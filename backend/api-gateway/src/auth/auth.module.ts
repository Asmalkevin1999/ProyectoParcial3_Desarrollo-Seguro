import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

import { JwtStrategy } from './jwt.strategy';

@Module({

  imports: [

    JwtModule.register({

      secret: process.env.JWT_ACCESS_SECRET,

    }),

  ],

  providers: [

    AuthService,

    JwtStrategy,

  ],

  exports: [

    AuthService,

    JwtModule,

  ],

})

export class AuthModule {}