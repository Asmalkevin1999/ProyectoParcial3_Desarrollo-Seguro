import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly authService: AuthService,
  ) {}

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token requerido');
    }

    const token = authHeader.replace('Bearer ', '');

    try {

      const payload = this.authService.verify(token);

      request.user = payload;

      return true;

    } catch {

      throw new UnauthorizedException('Token inválido');

    }

  }

}