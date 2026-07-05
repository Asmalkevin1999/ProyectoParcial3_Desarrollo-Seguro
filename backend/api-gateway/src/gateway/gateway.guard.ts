import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GatewayGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {

    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {

      throw new UnauthorizedException('Token requerido');

    }

    if (!authorization.startsWith('Bearer ')) {

      throw new UnauthorizedException('Formato de token inválido');

    }

    return true;

  }

}