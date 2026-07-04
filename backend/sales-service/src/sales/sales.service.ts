import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';

import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()

export class SalesService {

  constructor(

    private prisma: PrismaService

  ) {}

  async create(dto: CreateSaleDto) {

    const total = dto.details.reduce(

      (sum, item) => sum + (item.price * item.quantity),

      0

    );

    return this.prisma.sale.create({

      data: {

        customerName: dto.customerName,

        total,

        details: {

          create: dto.details

        }

      },

      include: {

        details: true

      }

    });

  }

  findAll() {

    return this.prisma.sale.findMany({

      include: {

        details: true

      }

    });

  }

}