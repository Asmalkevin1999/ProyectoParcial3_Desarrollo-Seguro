import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';

import { JwtAuthGuard } from './jwt-auth.guard';

@Module({

  imports: [

    ConfigModule,

    JwtModule.register({

      secret: process.env.JWT_ACCESS_SECRET,

    }),

  ],

  providers: [

    AuthService,

    JwtAuthGuard,

  ],

  exports: [

    AuthService,

    JwtAuthGuard,

  ],

})

export class AuthModule {}