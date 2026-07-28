import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

import { PrismaModule } from '../database/prisma/prisma.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({

  imports: [

    ConfigModule,

    JwtModule.register({}),

    PrismaModule,

  ],

  controllers: [

    AuthController,

  ],

  providers: [

    AuthService,

    JwtStrategy,

    JwtAuthGuard,

    RolesGuard,

    Reflector,

  ],

  exports: [

    AuthService,

    JwtAuthGuard,

    RolesGuard,

  ],

})
export class AuthModule {}