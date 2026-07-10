import { Injectable } from '@nestjs/common';

import { PrismaService } from '../database/prisma/prisma.service';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {

  constructor(
    private readonly prisma: PrismaService,
  ) {}

  //=========================================
  // CREAR
  //=========================================

  async create(dto: CreateMenuDto) {

    return this.prisma.menu.create({

      data: dto,

    });

  }

  //=========================================
  // LISTAR
  //=========================================

  async findAll() {

    return this.prisma.menu.findMany({

      include: {

        module: true,

        parent: true,

      },

      orderBy: {

        order: 'asc',

      },

    });

  }

  //=========================================
  // BUSCAR UNO
  //=========================================

  async findOne(id: string) {

    return this.prisma.menu.findUnique({

      where: {

        id,

      },

      include: {

        module: true,

        parent: true,

        children: true,

      },

    });

  }

  //=========================================
  // ACTUALIZAR
  //=========================================

  async update(

    id: string,

    dto: UpdateMenuDto,

  ) {

    return this.prisma.menu.update({

      where: {

        id,

      },

      data: dto,

    });

  }

  //=========================================
  // ELIMINAR
  //=========================================

  async remove(id: string) {

    return this.prisma.menu.delete({

      where: {

        id,

      },

    });

  }

  //=========================================
  // MENU SEGUN EL ROL
  //=========================================

  async getMyMenu(roleId: string) {

    const roleModules =
      await this.prisma.roleModule.findMany({

        where: {

          roleId,

          status: true,

        },

        include: {

          module: true,

        },

      });

    const roleMenus =
      await this.prisma.roleMenu.findMany({

        where: {

          roleId,

          status: true,

        },

        include: {

          menu: true,

        },

      });

    return roleModules.map((rm) => ({

      id: rm.module.id,

      name: rm.module.name,

      description: rm.module.description,

      icon: rm.module.icon,

      menus: roleMenus

        .filter(

          (menu) =>

            menu.menu.moduleId === rm.module.id,

        )

        .sort(

          (a, b) =>

            a.menu.order - b.menu.order,

        )

        .map((menu) => ({

          id: menu.menu.id,

          name: menu.menu.name,

          url: menu.menu.url,

          icon: menu.menu.icon,

          order: menu.menu.order,

          parentId: menu.menu.parentId,

        })),

    }));

  }

  //=========================================
  // MENU ADMIN
  //=========================================

  async getAdminMenu() {

    return this.prisma.menu.findMany({

      where: {

        status: true,

        parentId: null,

      },

      include: {

        children: {

          where: {

            status: true,

          },

          include: {

            children: {

              where: {

                status: true,

              },

              orderBy: {

                order: 'asc',

              },

            },

          },

          orderBy: {

            order: 'asc',

          },

        },

      },

      orderBy: {

        order: 'asc',

      },

    });

  }

}