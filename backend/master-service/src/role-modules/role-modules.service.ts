import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateRoleModuleDto } from './dto/create-role-module.dto';
import { UpdateRoleModuleDto } from './dto/update-role-module.dto';

@Injectable()
export class RoleModulesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleModuleDto) {
    const existing = await this.prisma.roleModule.findFirst({
      where: {
        roleId: dto.roleId,
        moduleId: dto.moduleId,
        status: true,
      },
    });

    if (existing) {
      throw new BadRequestException('La relación rol-módulo ya existe');
    }

    return this.prisma.roleModule.create({
      data: {
        roleId: dto.roleId,
        moduleId: dto.moduleId,
        status: true,
        createdBy: null,
        updatedBy: null,
      },
      include: {
        role: true,
        module: true,
      },
    });
  }

  async findAll() {
    return this.prisma.roleModule.findMany({
      where: { status: true },
      include: {
        role: true,
        module: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const relation = await this.prisma.roleModule.findFirst({
      where: { id, status: true },
      include: {
        role: true,
        module: true,
      },
    });

    if (!relation) {
      throw new NotFoundException('Relación no encontrada');
    }

    return relation;
  }

  async update(id: string, dto: UpdateRoleModuleDto) {
    const existing = await this.prisma.roleModule.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Relación no encontrada');
    }

    return this.prisma.roleModule.update({
      where: { id },
      data: dto,
      include: {
        role: true,
        module: true,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.roleModule.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Relación no encontrada');
    }

    return this.prisma.roleModule.update({
      where: { id },
      data: { status: false, updatedAt: new Date() },
    });
  }
}