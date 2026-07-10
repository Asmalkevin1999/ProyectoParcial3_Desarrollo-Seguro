import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private readonly jwt: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {

    const request = context.switchToHttp().getRequest();

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

    try {

      const payload =
        this.jwt.verify(token);

      request.user = payload;

      return true;

    } catch {

      throw new UnauthorizedException(
        'Token inválido',
      );

    }

  }

}