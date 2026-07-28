import {

Body,

Controller,

Delete,

Get,

Param,

Patch,

Post,

} from '@nestjs/common';

import { RoleModulesService } from './role-modules.service';

import { CreateRoleModuleDto } from './dto/create-role-module.dto';

import { UpdateRoleModuleDto } from './dto/update-role-module.dto';

@Controller('role-modules')

export class RoleModulesController{

constructor(

private readonly service:RoleModulesService

){}

@Post()

create(

@Body()

dto:CreateRoleModuleDto

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

id:string

){

return this.service.findOne(id);

}

@Patch(':id')

update(

@Param('id')

id:string,

@Body()

dto:UpdateRoleModuleDto

){

return this.service.update(id,dto);

}

@Delete(':id')

remove(

@Param('id')

id:string

){

return this.service.remove(id);

}

}