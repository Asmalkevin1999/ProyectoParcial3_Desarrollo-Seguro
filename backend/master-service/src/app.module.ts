import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import envConfiguration from './config/env/env.configuration';
import jwtConfiguration from './config/jwt/jwt.configuration';
import databaseConfiguration from './config/database/database.configuration';

import { PrismaModule } from './database/prisma/prisma.module';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { MenusModule } from './menus/menus.module';

@Module({
  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

      load: [

        envConfiguration,

        jwtConfiguration,

        databaseConfiguration

      ]

    }),

    PrismaModule,

    AuthModule,

    UsersModule,

    RolesModule,

    MenusModule

  ]

})
export class AppModule {}