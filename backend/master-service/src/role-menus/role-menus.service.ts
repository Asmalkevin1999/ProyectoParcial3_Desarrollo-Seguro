import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateRoleMenuDto } from './dto/create-role-menu.dto';
import { UpdateRoleMenuDto } from './dto/update-role-menu.dto';

@Injectable()
export class RoleMenusService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateRoleMenuDto) {

    return this.prisma.roleMenu.create({

      data: {

        roleId: dto.roleId,

        menuId: dto.menuId,

      },

      include: {

        role: true,

        menu: true,

      },

    });

  }

  async findAll() {

    return this.prisma.roleMenu.findMany({

      include: {

        role: true,

        menu: true,

      },

      orderBy: {

        createdAt: 'asc',

      },

    });

  }

  async findOne(id: string) {

    const relation = await this.prisma.roleMenu.findUnique({

      where: {

        id,

      },

      include: {

        role: true,

        menu: true,

      },

    });

    if (!relation) {

      throw new NotFoundException(
        'Relación no encontrada',
      );

    }

    return relation;

  }

  async update(
    id: string,
    dto: UpdateRoleMenuDto,
  ) {

    return this.prisma.roleMenu.update({

      where: {

        id,

      },

      data: dto,

      include: {

        role: true,

        menu: true,

      },

    });

  }

  async remove(id: string) {

    return this.prisma.roleMenu.delete({

      where: {

        id,

      },

    });

  }

}