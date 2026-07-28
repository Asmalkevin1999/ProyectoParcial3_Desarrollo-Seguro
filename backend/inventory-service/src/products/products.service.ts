import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateProductDto) {

    return await this.prisma.product.create({

      data: dto,

      include: {

        category: true,

      },

    });

  }

  async findAll() {

    return await this.prisma.product.findMany({

      include: {

        category: true,

      },

      orderBy: {

        createdAt: 'desc',

      },

    });

  }

}