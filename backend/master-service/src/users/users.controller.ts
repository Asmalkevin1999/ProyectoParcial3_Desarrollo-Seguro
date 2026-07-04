import {
Controller,
Get
} from '@nestjs/common';


import { UsersService } from './users.service';


import { Roles } from '../auth/decorators/roles.decorator';



@Controller('users')
export class UsersController {



constructor(

private readonly usersService: UsersService

){}




@Get()

@Roles('ADMIN')

async findAll(){



return this.usersService.findAll();



}



}