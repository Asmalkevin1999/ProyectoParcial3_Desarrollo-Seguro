import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AuditService } from './audit.service';
import { CreateAuditDto } from './dto/create-audit.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('audit')
@UseGuards(
  JwtAuthGuard,
  RolesGuard,
)
export class AuditController {

  constructor(
    private readonly auditService: AuditService,
  ) {}

  @Post()
  @Roles('ADMIN')
  create(
    @Body() dto: CreateAuditDto,
  ) {

    return this.auditService.create(dto);

  }

  @Get()
  @Roles('ADMIN')
  findAll() {

    return this.auditService.findAll();

  }

}