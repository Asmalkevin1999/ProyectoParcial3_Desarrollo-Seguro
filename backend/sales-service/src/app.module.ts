import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './database/prisma.module';

import { AuthModule } from './auth/auth.module';

import { SalesModule } from './sales/sales.module';

@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true

    }),

    PrismaModule,

    AuthModule,

    SalesModule

  ]

})

export class AppModule {}