import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateRoleMenuDto } from './dto/create-role-menu.dto';
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto';

@Injectable()
export class RoleMenusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleMenuDto) {
    const existing = await this.prisma.roleMenu.findFirst({
      where: {
        roleId: dto.roleId,
        menuId: dto.menuId,
        status: true,
      },
    });

    if (existing) {
      throw new BadRequestException('La relación rol-menú ya existe');
    }

    return this.prisma.roleMenu.create({
      data: {
        roleId: dto.roleId,
        menuId: dto.menuId,
        status: true,
        createdBy: null,
        updatedBy: null,
      },
      include: {
        role: true,
        menu: true,
      },
    });
  }

  async findAll() {
    return this.prisma.roleMenu.findMany({
      where: { status: true },
      include: {
        role: true,
        menu: true,
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string) {
    const relation = await this.prisma.roleMenu.findFirst({
      where: { id, status: true },
      include: {
        role: true,
        menu: true,
      },
    });

    if (!relation) {
      throw new NotFoundException('Relación no encontrada');
    }

    return relation;
  }

  async update(id: string, dto: UpdateRoleMenuDto) {
    const existing = await this.prisma.roleMenu.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Relación no encontrada');
    }

    return this.prisma.roleMenu.update({
      where: { id },
      data: dto,
      include: {
        role: true,
        menu: true,
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.roleMenu.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Relación no encontrada');
    }

    return this.prisma.roleMenu.update({
      where: { id },
      data: { status: false, updatedAt: new Date() },
    });
  }
}