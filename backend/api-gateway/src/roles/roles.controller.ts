import {
  Controller,
  Get,
  Headers,
} from '@nestjs/common';

import { MasterClient } from '../clients/master.client';

@Controller('roles')
export class RolesController {

  constructor(
    private readonly masterClient: MasterClient,
  ) {}

  @Get()
  findAll(
    @Headers('authorization') token: string,
  ) {
    return this.masterClient.getRoles(token);
  }

}