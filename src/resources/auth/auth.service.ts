import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';
import { SignInDto } from './dto/sign-in.dto';
import { User } from 'src/entities/User.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { CryptoService } from 'src/services/crypto/crypto.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { EmailService } from 'src/services/email/email.service';

@Injectable()
export class AuthService {
  private columns: (keyof User)[] = [
    'id',
    'email',
    'firstname',
    'lastname',
    'isActive',
    'rol',
  ];
  private logger = new Logger('AuthService');
  private catchError = (err: any) => {
    this.logger.error(err);

    if (err instanceof HttpException) {
      throw err;
    } else if (err instanceof EntityNotFoundError) {
      throw new BadRequestException('Bad request');
    } else if (err instanceof QueryFailedError) {
      throw new BadRequestException(
        'Email ' + err.parameters[0] + ' already exist.',
      );
    }
    throw new InternalServerErrorException();
  };

  constructor(
    private cryptoService: CryptoService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private emailService: EmailService,
  ) {}

  async signIn(payload: SignInDto) {
    return this.usersRepository
      .findOneOrFail({
        select: ['password'],
        where: { email: payload.email },
      })
      .then(async (user) => {
        if (!this.cryptoService.validate(payload.password, user.password)) {
          throw new UnauthorizedException('Email or password is wrong!');
        }
        const userFromBD = await this.findOne(user.id);
        return this.session(userFromBD);
      })
      .catch((err) => {
        if (err instanceof EntityNotFoundError) {
          throw new UnauthorizedException('Email or password is wrong!');
        }
        throw err;
      })
      .catch(this.catchError);
  }

  private generateString(n: number) {
    return this.cryptoService.generateString(n);
  }

  async validateToken(token: string) {
    const userId = await this.cacheManager.get(token);
    const user = await this.findOne(userId as number);

    return { token, user };
  }

  async session(user: User, token: string = this.generateString(32)) {
    await this.cacheManager.set(token, user.id, 86400000 * 30);

    return { token, user };
  }

  async findOne(id: number) {
    return this.usersRepository
      .findOneOrFail({
        select: this.columns,
        where: { id },
      })
      .catch(this.catchError);
  }

  async signUp(payload: SignUpDto) {
    const encoded = this.cryptoService.encode(payload.password);
    return this.usersRepository
      .save({
        ...payload,
        password: encoded,
      })
      .then((user) => {
        this.emailService.send({
          to: user.email,
          subject: 'Welcome to FakeBook',
          html: `
            <h1>Welcome to FakeBook</h1>
            <p>Hi ${user.firstname} ${user.lastname},</p>
            <p>Thanks for signing up for FakeBook! We're excited to have you as an early user.</p>
            <p>Best,</p>
            <p>The FakeBook Team</p>
          `,
        });
        this.findOne(user.id);
      })
      .catch(this.catchError);
  }
}
