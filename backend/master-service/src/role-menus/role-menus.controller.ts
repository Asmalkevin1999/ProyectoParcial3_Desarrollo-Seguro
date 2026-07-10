import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { RoleMenusService } from './role-menus.service';

import { CreateRoleMenuDto } from './dto/create-role-menu.dto';
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto';

@Controller('role-menus')
export class RoleMenusController {

  constructor(
    private readonly service: RoleMenusService,
  ) {}

  @Post()
  create(
    @Body()
    dto: CreateRoleMenuDto,
  ) {

    return this.service.create(dto);

  }

  @Get()
  findAll() {

    return this.service.findAll();

  }

  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {

    return this.service.findOne(id);

  }

  @Patch(':id')
  update(

    @Param('id')
    id: string,

    @Body()
    dto: UpdateRoleMenuDto,

  ) {

    return this.service.update(
      id,
      dto,
    );

  }

  @Delete(':id')
  remove(
    @Param('id')
    id: string,
  ) {

    return this.service.remove(id);

  }

}