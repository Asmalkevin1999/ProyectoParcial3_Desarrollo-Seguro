import {

Controller,

Post,

Get,

Body,

UseGuards

} from '@nestjs/common';

import { SalesService } from './sales.service';

import { CreateSaleDto } from './dto/create-sale.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

@Controller('sales')

@UseGuards(JwtAuthGuard, RolesGuard)

export class SalesController {

  constructor(

    private readonly salesService: SalesService

  ) {}

  @Post()

  @Roles('ADMIN')

  create(

    @Body() dto: CreateSaleDto

  ) {

    return this.salesService.create(dto);

  }

  @Get()

  @Roles('ADMIN')

  findAll() {

    return this.salesService.findAll();

  }

}