import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserRolesService } from './user-roles.service';

import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Controller('user-roles')
export class UserRolesController {

  constructor(

    private readonly service:UserRolesService,

  ){}

  @Post()
  create(

    @Body()

    dto:CreateUserRoleDto,

  ){

    return this.service.create(dto);

  }

  @Get()
  findAll(){

    return this.service.findAll();

  }

  @Get(':id')
  findOne(

    @Param('id')

    id:string,

  ){

    return this.service.findOne(id);

  }

  @Patch(':id')
  update(

    @Param('id')

    id:string,

    @Body()

    dto:UpdateUserRoleDto,

  ){

    return this.service.update(id,dto);

  }

  @Delete(':id')
  remove(

    @Param('id')

    id:string,

  ){

    return this.service.remove(id);

  }

}