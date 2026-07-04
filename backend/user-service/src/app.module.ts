import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { PrismaModule } from './database/prisma.module';

import { ProfilesModule } from './profiles/profiles.module';
import { SessionsModule } from './sessions/sessions.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios';

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

})
export class AppModule {}