import { Controller, Get, Post, Body, Headers } from '@nestjs/common';
import { ReservationsService } from '../reservations/reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly service: ReservationsService) {}

  @Get()
  findAll(@Headers('authorization') token: string) {
    return this.service.findAll(token);
  }

  @Post()
  create(@Headers('authorization') token: string, @Body() dto: any) {
    return this.service.create(token, dto);
  }

  @Get('stats')
  getStats(@Headers('authorization') token: string) {
    return this.service.findStats(token);
  }
}
