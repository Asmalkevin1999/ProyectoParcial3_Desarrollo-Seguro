import {
Controller,
Get
} from '@nestjs/common';


import { MenusService } from './menus.service';


import { Roles } from '../auth/decorators/roles.decorator';



@Controller('menus')
export class MenusController {



constructor(

private readonly menusService:MenusService

){}




@Get('my-menu')

@Roles('ADMIN')

async myMenu(){


return this.menusService.getAdminMenu();


}



}