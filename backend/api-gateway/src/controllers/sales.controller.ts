import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
} from '@nestjs/common';

import { SalesService } from '../sales/sales.service';

@Controller('sales')
export class SalesController {

  constructor(

    private readonly service: SalesService,

  ) {}

  @Post()

  create(

    @Headers('authorization')
    token: string,

    @Body()
    dto: any,

  ) {

    return this.service.create(token, dto);

  }

  @Get()

  findAll(

    @Headers('authorization')
    token: string,

  ) {

    return this.service.findAll(token);

  }

}