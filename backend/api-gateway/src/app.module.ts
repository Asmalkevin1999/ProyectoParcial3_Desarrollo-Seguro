import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HttpConfig, JwtConfig } from './config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';

import { MasterClient } from './clients/master.client';
import { UserClient } from './clients/user.client';
import { InventoryClient } from './clients/inventory.client';
import { SalesClient } from './clients/sales.client';
import { HrClient } from './clients/hr.client';

@Module({
  imports: [

ConfigModule.forRoot({

  isGlobal: true,

  load: [

    HttpConfig,

    JwtConfig,

  ],

}),

    HttpModule,

    AuthModule,

  ],

  controllers: [

    AppController,

  ],

  providers: [

    AppService,

    MasterClient,

    UserClient,

    InventoryClient,

    SalesClient,

    HrClient,

  ],

})
export class AppModule {}