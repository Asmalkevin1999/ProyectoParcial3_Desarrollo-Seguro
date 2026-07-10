import {
  Controller,
  Get,
  Headers,
} from '@nestjs/common';

import { MasterClient } from '../clients/master.client';

@Controller('menus')
export class MenusController {

  constructor(

    private readonly masterClient: MasterClient,

  ) {}

  @Get('my-menu')
  getMyMenu(

    @Headers('authorization')

    token: string,

  ) {

    return this.masterClient.getMenus(

      token,

    );

  }

}