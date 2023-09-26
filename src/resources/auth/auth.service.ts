import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  HttpException,
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

@Injectable()
export class AuthService {
  private columns: (keyof User)[] = [
    'id',
    'email',
    'firstname',
    'lastname',
    'isActive',
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

  async session(user: User) {
    const token = this.cryptoService.generateString(32);

    return {
      token,
      session: user,
    };
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
      .then((user) => this.findOne(user.id))
      .catch(this.catchError);
  }
}
