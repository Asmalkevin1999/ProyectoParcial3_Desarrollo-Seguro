import { Module } from '@nestjs/common';

import { PrismaModule } from '../database/prisma/prisma.module';

import { RoleModulesController } from './role-modules.controller';

import { RoleModulesService } from './role-modules.service';

@Module({

imports:[

PrismaModule

],

controllers:[

RoleModulesController

],

providers:[

RoleModulesService

]

})

export class RoleModulesModule{}