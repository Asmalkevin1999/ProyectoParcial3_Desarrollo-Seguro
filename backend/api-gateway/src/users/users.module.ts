import { Module } from '@nestjs/common';

import { HttpModule } from '@nestjs/axios';

import { UsersController } from '../controllers/users.controller';
import { UsersService } from './users.service';

import { UserClient } from '../clients/user.client';

@Module({

  imports: [

    HttpModule,

  ],

  controllers: [

    UsersController,

  ],

  providers: [

    UsersService,

    UserClient,

  ],

  exports: [

    UsersService,

  ],

})

export class UsersModule {}