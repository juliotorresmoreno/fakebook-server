import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { IncomingMessage } from 'http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/resources/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  _canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req: IncomingMessage = context.switchToHttp().getRequest();
    let token = req.headers.authorization ?? '';
    let accessToken = req.headers.cookie ?? '';
    token = token.split('Bearer ')[1] ?? '';
    accessToken = accessToken.split('accessToken=')[1] ?? '';

    const authService = this.authService;
    const authorization = token || accessToken;

    return authService
      .validateToken(authorization)
      .then((session) => {
        (req as any).session = session;
        return true;
      })
      .catch(() => false);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this._canActivate(context);
  }
}
