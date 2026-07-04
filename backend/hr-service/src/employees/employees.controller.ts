import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';

import { EmployeesService } from './employees.service';

import { CreateEmployeeDto } from './dto/create-employee.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { RolesGuard } from '../auth/guards/roles.guard';

import { Roles } from '../auth/decorators/roles.decorator';

@Controller('employees')

@UseGuards(JwtAuthGuard, RolesGuard)

export class EmployeesController {

  constructor(
    private readonly employeesService: EmployeesService
  ) {}

  @Post()

  @Roles('ADMIN')

  create(@Body() dto: CreateEmployeeDto) {

    return this.employeesService.create(dto);

  }

  @Get()

  @Roles('ADMIN')

  findAll() {

    return this.employeesService.findAll();

  }

}