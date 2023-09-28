import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from 'src/entities/User.entity';
import { AuthGuard } from '../auth/auth.guard';
import { IncomingMessage } from 'http';
import { AuthService } from 'src/resources/auth/auth.service';
import { Reflector } from '@nestjs/core';
import { RolesDecorator } from 'src/roles';

@Injectable()
export class RolesGuard extends AuthGuard implements CanActivate {
  constructor(
    authService: AuthService,
    private reflector: Reflector,
  ) {
    super(authService);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get(RolesDecorator, context.getHandler());
    const canActivate = this._canActivate(context);
    if (!(canActivate instanceof Promise)) return canActivate;

    return canActivate.then((result) => {
      if (result === false) return false;

      const req: IncomingMessage = context.switchToHttp().getRequest();
      const user: User = (req as any).session.user;

      if (user.rol === 'super-admin') return true;

      return roles.includes(user.rol);
    });
  }
}
