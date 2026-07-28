import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './database/prisma.module';

import { AuthModule } from './auth/auth.module';

import { SalesModule } from './sales/sales.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

    }),

    PrismaModule,

    AuthModule,

    SalesModule,

  ],

  controllers: [

    AppController,

  ],

  providers: [

    AppService,

  ],

})

export class AppModule {}