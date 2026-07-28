import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

import { HttpConfig, JwtConfig } from './config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { GatewayModule } from './gateway/gateway.module';

import { MasterClient } from './clients/master.client';
import { UserClient } from './clients/user.client';
import { InventoryClient } from './clients/inventory.client';
import { SalesClient } from './clients/sales.client';
import { HrClient } from './clients/hr.client';

import { AuthController } from './controllers/auth.controller';
import { UsersController } from './controllers/users.controller';
import { SalesController } from './controllers/sales.controller';
import { HrController } from './controllers/hr.controller';

import { UsersModule } from './users/users.module';

import { InventoryModule } from './inventory/inventory.module';

import { SalesModule } from './sales/sales.module';

import { HrModule } from './hr/hr.module';
import { ReservationsModule } from './reservations/reservations.module';

import { MenusController } from './menus/menus.controller';
import { ModulesController } from './modules/modules.controller';
import { RolesController } from './roles/roles.controller';

import { MasterController } from './controllers/master.controller';
import { ReservationsController } from './controllers/reservations.controller';

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

    ConfigModule,

    AuthModule,

    UsersModule,

    GatewayModule,

    InventoryModule,

    SalesModule,

    HrModule,
    ReservationsModule,

  ],

  controllers: [

    AppController,

    AuthController,

    UsersController,

    SalesController,

    HrController,
    
    MenusController,

    ModulesController,

    RolesController,

    MasterController,
    ReservationsController,

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