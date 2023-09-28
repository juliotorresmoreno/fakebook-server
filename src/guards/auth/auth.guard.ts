import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { User } from 'src/entities/User.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthGuard implements CanActivate {
  private columns: (keyof User)[] = [
    'id',
    'email',
    'firstname',
    'lastname',
    'isActive',
  ];
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: IncomingMessage = context.switchToHttp().getRequest();
    let token = req.headers.authorization ?? '';
    let accessToken = req.headers.cookie ?? '';
    token = token.split('Bearer ')[1] ?? '';
    accessToken = accessToken.split('accessToken=')[1] ?? '';

    const cacheManager = this.cacheManager;
    const authorization = token || accessToken;

    return cacheManager.get(authorization).then((id) => {
      if (id === undefined) return false;
      return this.usersRepository
        .findOne({
          where: { id: id as number },
          select: this.columns,
          cache: 30000,
        })
        .then((user) => {
          (req as any).session = { token: authorization, user };
          return user !== undefined;
        });
    });
  }
}
