import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuditService } from './audit.service';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditController {

  constructor(
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Req() req: any,
    @Body() dto: any,
  ) {
    return this.auditService.create({
      ...dto,
      userId: req.user.id,
    });
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.auditService.findAll();
  }

}