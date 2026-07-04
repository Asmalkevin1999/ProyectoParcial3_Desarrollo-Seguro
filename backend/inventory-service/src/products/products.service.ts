import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    private prisma: PrismaService
  ) {}

  create(dto: CreateProductDto) {

    return this.prisma.product.create({

      data: dto

    });

  }

  findAll() {

    return this.prisma.product.findMany({

      include: {

        category: true

      }

    });

  }

}