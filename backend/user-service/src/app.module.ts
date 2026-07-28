import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { PrismaModule } from './database/prisma.module';

import { AuthModule } from './auth/auth.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuditModule } from './audit/audit.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({

  imports: [

    ConfigModule.forRoot({

      isGlobal: true,

    }),

    HttpModule,

    PrismaModule,

    AuthModule,

    ProfilesModule,

    SessionsModule,

    AuditModule,

  ],

  controllers: [

    AppController,

  ],

  providers: [

    AppService,

  ],

})
export class AppModule {}