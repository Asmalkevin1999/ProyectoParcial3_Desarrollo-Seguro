import {
  Controller,
  Get,
  Headers,
} from '@nestjs/common';

import { MasterClient } from '../clients/master.client';

@Controller('master')
export class MasterController {

  constructor(
    private readonly master: MasterClient,
  ) {}

  @Get('modules')
  getModules(
    @Headers('authorization')
    token: string,
  ) {
    return this.master.getModules(token);
  }

  @Get('menus')
  getMenus(
    @Headers('authorization')
    token: string,
  ) {
    return this.master.getMenus(token);
  }

  @Get('users')
  getUsers(
    @Headers('authorization')
    token: string,
  ) {
    return this.master.getUsers(token);
  }

}