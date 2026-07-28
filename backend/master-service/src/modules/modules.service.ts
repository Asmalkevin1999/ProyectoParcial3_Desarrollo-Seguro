import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateModuleDto) {
    const existing = await this.prisma.module.findFirst({
      where: { name: dto.name, status: true },
    });

    if (existing) {
      throw new BadRequestException('El módulo ya existe');
    }

    return this.prisma.module.create({
      data: {
        ...dto,
        status: true,
      },
    });
  }

  findAll() {
    return this.prisma.module.findMany({
      where: { status: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const module = await this.prisma.module.findFirst({
      where: { id, status: true },
    });

    if (!module) {
      throw new NotFoundException('Módulo no encontrado');
    }

    return module;
  }

  async update(id: string, dto: UpdateModuleDto) {
    const existing = await this.prisma.module.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Módulo no encontrado');
    }

    return this.prisma.module.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.module.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Módulo no encontrado');
    }

    return this.prisma.module.update({
      where: { id },
      data: { status: false, updatedAt: new Date() },
    });
  }
}