import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()

export class EmployeesService {

  constructor(
    private prisma: PrismaService
  ) {}

  create(dto: CreateEmployeeDto) {

    return this.prisma.employee.create({

      data: {

        ...dto,

        hireDate: new Date(dto.hireDate)

      }

    });

  }

  findAll() {

    return this.prisma.employee.findMany({

      orderBy: {

        createdAt: 'desc'

      }

    });

  }

}