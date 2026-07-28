import {
  Body,
  Controller,
  Headers,
  Post,
} from '@nestjs/common';

import { MasterClient } from '../clients/master.client';

@Controller('auth')
export class AuthController {

  constructor(

    private readonly masterClient: MasterClient,

  ) {}

  @Post('register')
  register(
    @Body() body: any,
  ) {

    return this.masterClient.register(body);

  }

  @Post('login')
  login(
    @Body() body: any,
  ) {

    return this.masterClient.login(body);

  }

  @Post('select-role')
  selectRole(

    @Headers('authorization')

    token: string,

    @Body()

    body: any,

  ) {

    return this.masterClient.selectRole(

      token,

      body.roleId,

    );

  }

}