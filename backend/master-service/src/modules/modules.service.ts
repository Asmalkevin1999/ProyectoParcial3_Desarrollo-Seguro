import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {

  constructor(
    private prisma: PrismaService,
  ) {}

  create(dto: CreateModuleDto) {
    return this.prisma.module.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.module.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  findOne(id: string) {
    return this.prisma.module.findUnique({
      where: { id },
    });
  }

  update(id: string, dto: UpdateModuleDto) {
    return this.prisma.module.update({
      where: { id },
      data: dto,
    });
  }

  remove(id: string) {
    return this.prisma.module.delete({
      where: { id },
    });
  }

}