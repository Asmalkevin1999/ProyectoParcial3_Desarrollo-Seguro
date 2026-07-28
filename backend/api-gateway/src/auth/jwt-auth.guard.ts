import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request =
      context.switchToHttp().getRequest();

    const auth =
      request.headers.authorization;

    if (!auth) {

      throw new UnauthorizedException(
        'Token requerido',
      );

    }

    const token = auth.replace(
      'Bearer ',
      '',
    );

    const payload =
      this.authService.verify(token);

    request.user = payload;

    return true;

  }

}