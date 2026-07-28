import { Module } from '@nestjs/common';

import { PassportModule } from '@nestjs/passport';

import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';

@Module({

  imports: [

    PassportModule,

    ConfigModule,

  ],

  providers: [

    AuthService,

    JwtStrategy,

  ],

  exports: [

    PassportModule,

    AuthService,

  ],

})

export class AuthModule {}