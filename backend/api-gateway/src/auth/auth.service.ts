import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly jwtService: JwtService,
  ) {}

  verify(token: string) {

    try {

      return this.jwtService.verify(token);

    } catch {

      throw new UnauthorizedException('Token inválido');

    }

  }

}