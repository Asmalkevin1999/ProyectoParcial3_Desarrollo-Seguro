import { Module } from '@nestjs/common';

import { PrismaModule } from '../database/prisma/prisma.module';

import { RoleMenusController } from './role-menus.controller';

import { RoleMenusService } from './role-menus.service';

@Module({

  imports: [

    PrismaModule,

  ],

  controllers: [

    RoleMenusController,

  ],

  providers: [

    RoleMenusService,

  ],

  exports: [

    RoleMenusService,

  ],

})

export class RoleMenusModule {}