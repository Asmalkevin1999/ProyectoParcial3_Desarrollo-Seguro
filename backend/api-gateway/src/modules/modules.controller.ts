import {
  Controller,
  Get,
  Headers,
} from '@nestjs/common';

import { MasterClient } from '../clients/master.client';

@Controller('modules')
export class ModulesController {

  constructor(
    private readonly masterClient: MasterClient,
  ) {}

  @Get()
  findAll(
    @Headers('authorization')
    token: string,
  ) {
    return this.masterClient.getModules(token);
  }

}