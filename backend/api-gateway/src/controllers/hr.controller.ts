import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
} from '@nestjs/common';

import { HrService } from '../hr/hr.service';

@Controller('employees')
export class HrController {

  constructor(

    private readonly service: HrService,

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