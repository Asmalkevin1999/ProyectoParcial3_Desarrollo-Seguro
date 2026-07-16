import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRoleDto) {
    const existing = await this.prisma.role.findFirst({
      where: { name: dto.name, status: true },
    });

    if (existing) {
      throw new BadRequestException('El rol ya existe');
    }

    return this.prisma.role.create({
      data: {
        ...dto,
        status: true,
      },
    });
  }

  findAll() {
    return this.prisma.role.findMany({
      where: { status: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findFirst({
      where: { id, status: true },
    });

    if (!role) {
      throw new NotFoundException('Rol no encontrado');
    }

    return role;
  }

  async update(id: string, dto: UpdateRoleDto) {
    const existing = await this.prisma.role.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Rol no encontrado');
    }

    return this.prisma.role.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const activeAssignments = await this.prisma.userRole.count({
      where: { roleId: id, status: true },
    });

    if (activeAssignments > 0) {
      throw new BadRequestException('No se puede eliminar un rol con usuarios activos');
    }

    const existing = await this.prisma.role.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Rol no encontrado');
    }

    return this.prisma.role.update({
      where: { id },
      data: { status: false, updatedAt: new Date() },
    });
  }
}