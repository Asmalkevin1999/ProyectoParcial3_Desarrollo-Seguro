import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { SessionsService } from './sessions.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('sessions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SessionsController {

  constructor(
    private readonly sessionsService: SessionsService,
  ) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Req() req: any,
    @Body() dto: any,
  ) {
    return this.sessionsService.create(
      req.user.id,
      dto,
    );
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.sessionsService.findAll();
  }

}