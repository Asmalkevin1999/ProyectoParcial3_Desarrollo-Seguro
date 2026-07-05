import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { GatewayService } from './gateway.service';
import { GatewayGuard } from './gateway.guard';

@Controller('gateway')
export class GatewayController {

  constructor(
    private readonly gatewayService: GatewayService,
  ) {}

  @UseGuards(GatewayGuard)
  @Get('health')
  health() {

    return this.gatewayService.health();

  }

}