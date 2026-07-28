import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

@Injectable()
export class MenusService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateMenuDto) {
    return this.prisma.menu.create({
      data: {
        ...dto,
        status: true,
      },
    });
  }

  async findAll() {
    return this.prisma.menu.findMany({
      where: { status: true },
      include: {
        module: true,
        parent: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  async findOne(id: string) {
    const menu = await this.prisma.menu.findFirst({
      where: { id, status: true },
      include: {
        module: true,
        parent: true,
        children: true,
      },
    });

    if (!menu) {
      throw new NotFoundException('Menú no encontrado');
    }

    return menu;
  }

  async update(id: string, dto: UpdateMenuDto) {
    const existing = await this.prisma.menu.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Menú no encontrado');
    }

    return this.prisma.menu.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.menu.findFirst({
      where: { id, status: true },
    });

    if (!existing) {
      throw new NotFoundException('Menú no encontrado');
    }

    return this.prisma.menu.update({
      where: { id },
      data: { status: false, updatedAt: new Date() },
    });
  }

  async getMyMenu(roleId: string) {
    const roleModules = await this.prisma.roleModule.findMany({
      where: {
        roleId,
        status: true,
        module: { status: true },
      },
      include: { module: true },
    });

    const roleMenus = await this.prisma.roleMenu.findMany({
      where: {
        roleId,
        status: true,
        menu: { status: true },
      },
      include: { menu: true },
    });

    const fallbackModules = [
      {
        id: 'administration',
        name: 'Administración',
        description: 'Módulos de administración',
        icon: '🧰',
        menus: [
          { id: 'administration-users', name: 'Usuarios', url: '', order: 1, parentId: null },
          { id: 'users-list', name: 'Lista de Usuarios', url: '/users/list', order: 1, parentId: 'administration-users' },
          { id: 'users-roles', name: 'Roles de Usuarios', url: '/users/roles', order: 2, parentId: 'administration-users' },
          { id: 'users-permissions', name: 'Permisos', url: '/users/permissions', order: 3, parentId: 'administration-users' },
          { id: 'administration-config', name: 'Configuración', url: '', order: 2, parentId: null },
          { id: 'roles', name: 'Roles', url: '/roles', order: 1, parentId: 'administration-config' },
          { id: 'menus', name: 'Menús', url: '/menus', order: 2, parentId: 'administration-config' },
          { id: 'modules', name: 'Módulos', url: '/modules', order: 3, parentId: 'administration-config' },
        ],
      },
      {
        id: 'sales',
        name: 'Ventas',
        description: 'Módulos de ventas',
        icon: '🛒',
        menus: [
          { id: 'sales-products-root', name: 'Productos', url: '', order: 1, parentId: null },
          { id: 'sales-products', name: 'Productos', url: '/sales/products', order: 1, parentId: 'sales-products-root' },
          { id: 'sales-categories', name: 'Categorías', url: '/sales/categories', order: 2, parentId: 'sales-products-root' },
          { id: 'sales-orders', name: 'Pedidos', url: '/sales/orders', order: 3, parentId: 'sales-products-root' },
        ],
      },
      {
        id: 'inventory',
        name: 'Inventario',
        description: 'Módulos de inventario',
        icon: '📦',
        menus: [
          { id: 'inventory-root', name: 'Gestión', url: '', order: 1, parentId: null },
          { id: 'inventory-products', name: 'Productos', url: '/inventory/products', order: 1, parentId: 'inventory-root' },
          { id: 'inventory-stock', name: 'Stock', url: '/inventory/stock', order: 2, parentId: 'inventory-root' },
          { id: 'inventory-movements', name: 'Movimientos', url: '/inventory/movements', order: 3, parentId: 'inventory-root' },
        ],
      },
      {
        id: 'hr',
        name: 'Recursos Humanos',
        description: 'Módulos de RRHH',
        icon: '👥',
        menus: [
          { id: 'hr-root', name: 'Personal', url: '', order: 1, parentId: null },
          { id: 'hr-employees', name: 'Empleados', url: '/hr/employees', order: 1, parentId: 'hr-root' },
          { id: 'hr-payroll', name: 'Nómina', url: '/hr/payroll', order: 2, parentId: 'hr-root' },
          { id: 'hr-attendance', name: 'Asistencia', url: '/hr/attendance', order: 3, parentId: 'hr-root' },
        ],
      },
    ];

    const response = roleModules.length > 0
      ? roleModules.map((rm) => ({
          id: rm.module.id,
          name: rm.module.name,
          description: rm.module.description,
          icon: rm.module.icon,
          menus: roleMenus
            .filter((item) => item.menu.moduleId === rm.module.id)
            .sort((a, b) => a.menu.order - b.menu.order)
            .map((item) => ({
              id: item.menu.id,
              name: item.menu.name,
              url: item.menu.url,
              icon: item.menu.icon,
              order: item.menu.order,
              parentId: item.menu.parentId,
            })),
        }))
      : fallbackModules;

    return response;
  }

  async getAdminMenu() {
    return this.prisma.menu.findMany({
      where: { status: true, parentId: null },
      include: {
        children: {
          where: { status: true },
          include: {
            children: {
              where: { status: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }
}