import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

function getSecret(config: ConfigService, key: string, fallback?: string) {
  return config.get<string>(key) || fallback || '';
}

@Injectable()
export class AuthService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  //=========================================================
  // REGISTER
  //=========================================================

  async register(data: RegisterDto) {

    const usernameExists = await this.prisma.user.findUnique({
      where: {
        username: data.username,
      },
    });

    if (usernameExists) {
      throw new BadRequestException(
        'El usuario ya existe',
      );
    }

    const emailExists = await this.prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (emailExists) {
      throw new BadRequestException(
        'El correo ya existe',
      );
    }

    const employeeRole = await this.prisma.role.findFirst({
      where: {
        name: 'EMPLOYEE',
      },
    });

    if (!employeeRole) {
      throw new BadRequestException(
        'No existe el rol EMPLOYEE',
      );
    }

    const password = await bcrypt.hash(
      data.password,
      10,
    );

    const user = await this.prisma.user.create({

      data: {

        username: data.username,

        email: data.email,

        password,

        firstName: data.firstName,

        lastName: data.lastName,

      },

    });

    await this.prisma.userRole.create({

      data: {

        userId: user.id,

        roleId: employeeRole.id,

      },

    });

    return {

      message: 'Usuario registrado correctamente',

    };

  }

  //=========================================================
  // LOGIN
  //=========================================================

  async login(data: LoginDto) {

    const user = await this.prisma.user.findUnique({

      where: {

        username: data.username,

      },

      include: {

        roles: {

          include: {

            role: true,

          },

        },

      },

    });

    if (!user) {

      throw new UnauthorizedException(
        'Usuario no encontrado',
      );

    }

    const validPassword = await bcrypt.compare(
      data.password,
      user.password,
    );

    if (!validPassword) {

      throw new UnauthorizedException(
        'Contraseña incorrecta',
      );

    }

    const tempToken = await this.jwt.signAsync(
      {
        sub: user.id,
        username: user.username,
        type: 'TEMP',
      },
      {
        secret: getSecret(
          this.config,
          'jwt.accessSecret',
          process.env.JWT_ACCESS_SECRET || 'MasterGatewayAccessSecret2026_ESPE_Parcial3',
        ),
        expiresIn: '5m',
      },
    );

    return {

      message: 'Seleccione un rol',

      tempToken,

      roles: user.roles.map((r) => ({

        id: r.role.id,

        name: r.role.name,

        description: r.role.description,

      })),

    };

  }


  //=====================================
// LOGOUT
//=====================================

async logout(refreshToken: string) {

  await this.prisma.refreshToken.updateMany({

    where: {

      token: refreshToken,

    },

    data: {

      revoked: true,

    },

  });

  return {

    message: 'Sesión cerrada',

  };

}

//=====================================
// REFRESH TOKEN
//=====================================

async refresh(refreshToken: string) {

  const stored = await this.prisma.refreshToken.findFirst({

    where: {

      token: refreshToken,

      revoked: false,

    },

    include: {

      user: true,

      role: true,

    },

  });

  if (!stored) {

    throw new UnauthorizedException(
      'Refresh Token inválido',
    );

  }

  if (stored.expiresAt < new Date()) {

    throw new UnauthorizedException(
      'Refresh Token expirado',
    );

  }

  const payload = {

    sub: stored.user.id,

    username: stored.user.username,

    roleId: stored.role.id,

    role: stored.role.name,

  };

  const accessToken = await this.jwt.signAsync(

    payload,

    {

      secret: this.config.get<string>(
        'jwt.accessSecret',
      ),

      expiresIn: '15m',

    },

  );

  return {

    accessToken,

  };

}

//=========================================================
// SELECT ROLE
//=========================================================

async selectRole(
  user: any,
  roleId: string,
) {

  if (user.type !== 'TEMP') {

    throw new UnauthorizedException(
      'Token inválido o expirado',
    );

  }

  if (!roleId || typeof roleId !== 'string' || roleId.trim() === '') {
    throw new BadRequestException(
      'roleId es requerido y debe ser una cadena válida',
    );
  }

  const userRole = await this.prisma.userRole.findFirst({
    where: {
      userId: user.id,
      roleId: roleId.trim(),
      status: true,
    },
    include: {
      role: true,
    },
  });

  if (!userRole) {
    throw new UnauthorizedException(
      'El rol no está asignado al usuario o no está activo',
    );
  }

  const payload = {
    sub: user.id,
    username: user.username,
    roleId: userRole.role.id,
    role: userRole.role.name,
  };

  const accessToken = await this.jwt.signAsync(
    payload,
    {
      secret: getSecret(
        this.config,
        'jwt.accessSecret',
        process.env.JWT_ACCESS_SECRET || 'MasterGatewayAccessSecret2026_ESPE_Parcial3',
      ),
      expiresIn: '15m',
    },
  );

  const refreshToken = await this.jwt.signAsync(
    payload,
    {
      secret: getSecret(
        this.config,
        'jwt.refreshSecret',
        process.env.JWT_REFRESH_SECRET || 'MasterGatewayRefreshSecret2026_ESPE_Parcial3',
      ),
      expiresIn: '7d',
    },
  );

  await this.prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      roleId: userRole.role.id,
      expiresAt: new Date(
        Date.now() +
        7 * 24 * 60 * 60 * 1000,
      ),
    },
  });

  return {
    message: 'Rol seleccionado correctamente',
    accessToken,
    refreshToken,
    role: userRole.role.name,
  };

}
}