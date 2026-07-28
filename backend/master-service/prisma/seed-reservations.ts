import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedReservationsModule() {
  const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
  if (!adminRole) return;

  const reservationsModule = await prisma.module.upsert({
    where: { name: 'Reservas' },
    update: {},
    create: {
      name: 'Reservas',
      description: 'Gestión de hoteles, huéspedes y reservas',
      icon: '🏨',
    },
  });

  const items = [
    { name: 'Hoteles', url: '/reservations/hotels', order: 1 },
    { name: 'Huéspedes', url: '/reservations/guests', order: 2 },
    { name: 'Reservas', url: '/reservations/list', order: 3 },
    { name: 'Estadísticas', url: '/reservations/stats', order: 4 },
  ];

  for (const item of items) {
    const existing = await prisma.menu.findFirst({ where: { name: item.name, moduleId: reservationsModule.id } });
    if (!existing) {
      await prisma.menu.create({ data: { ...item, moduleId: reservationsModule.id } });
    }
  }

  const existingModuleRelation = await prisma.roleModule.findFirst({
    where: { roleId: adminRole.id, moduleId: reservationsModule.id },
  });

  if (!existingModuleRelation) {
    await prisma.roleModule.create({ data: { roleId: adminRole.id, moduleId: reservationsModule.id } });
  }

  const allMenus = await prisma.menu.findMany({ where: { moduleId: reservationsModule.id } });
  for (const menu of allMenus) {
    const existingRoleMenu = await prisma.roleMenu.findFirst({ where: { roleId: adminRole.id, menuId: menu.id } });
    if (!existingRoleMenu) {
      await prisma.roleMenu.create({ data: { roleId: adminRole.id, menuId: menu.id } });
    }
  }

  await prisma.$disconnect();
}
