import {

  Body,

  Controller,

  Delete,

  Get,

  Param,

  Patch,

  Post,

  Req,

  UseGuards,

} from '@nestjs/common';

import { MenusService } from './menus.service';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('menus')
export class MenusController {

  constructor(

    private readonly menusService: MenusService,

  ) {}

  //=========================================
  // CREAR
  //=========================================

  @Post()
  create(

    @Body() dto: CreateMenuDto,

  ) {

    return this.menusService.create(dto);

  }

  //=========================================
  // TODOS
  //=========================================

  @Get()
  findAll() {

    return this.menusService.findAll();

  }

  //=========================================
  // MENU ADMIN
  //=========================================

  @Get('tree')
  getTree() {

    return this.menusService.getAdminMenu();

  }

  //=========================================
  // MENU DEL USUARIO
  //=========================================

@Get('my-menu')
@UseGuards(JwtAuthGuard)
getMyMenu(@Req() req: any) {

  console.log(req.user);

  return this.menusService.getMyMenu(
    req.user.roleId,
  );

}
  //=========================================
  // UNO
  //=========================================

  @Get(':id')
  findOne(

    @Param('id') id: string,

  ) {

    return this.menusService.findOne(id);

  }

  //=========================================
  // UPDATE
  //=========================================

  @Patch(':id')
  update(

    @Param('id') id: string,

    @Body() dto: UpdateMenuDto,

  ) {

    return this.menusService.update(

      id,

      dto,

    );

  }

  //=========================================
  // DELETE
  //=========================================

  @Delete(':id')
  remove(

    @Param('id') id: string,

  ) {

    return this.menusService.remove(id);

  }

}