import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoriesService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateCategoryDto) {

    return await this.prisma.category.create({

      data: dto,

    });

  }

  async findAll() {

    return await this.prisma.category.findMany({

      orderBy: {

        createdAt: 'desc',

      },

    });

  }

}