import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateUserRoleDto } from './dto/create-user-role.dto';
import { UpdateUserRoleDto } from './dto/update-user-role.dto';

@Injectable()
export class UserRolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserRoleDto) {
    const exists = await this.prisma.userRole.findFirst({
      where: {
        userId: dto.userId,
        roleId: dto.roleId,
        status: true,
      },
    });

    if (exists) {
      throw new BadRequestException('El usuario ya tiene ese rol activo');
    }

    return this.prisma.userRole.create({
      data: {
        ...dto,
        status: true,
        createdBy: null,
        updatedBy: null,
      },
      include: {
        user: true,
        role: true,
      },
    });
  }

  async findAll() {
    return this.prisma.userRole.findMany({
      where: { status: true },
      include: {
        user: true,
        role: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const relation = await this.prisma.userRole.findFirst({
      where: { id, status: true },
      include: {
        user: true,
        role: true,
      },
    });

    if (!relation) {
      throw new NotFoundException('Asignación no encontrada');
    }

    return relation;
  }

  async update(id: string, dto: UpdateUserRoleDto) {
    const existing = await this.prisma.userRole.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Asignación no encontrada');
    }

    return this.prisma.userRole.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.userRole.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Asignación no encontrada');
    }

    return this.prisma.userRole.update({
      where: { id },
      data: { status: false, updatedAt: new Date() },
    });
  }
}