import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const password = await bcrypt.hash(
    'Admin2026!',
    12,
  );

  // ===================================
  // ROLES
  // ===================================

  const adminRole = await prisma.role.upsert({

    where: {
      name: 'ADMIN',
    },

    update: {},

    create: {

      name: 'ADMIN',

      description: 'Administrador del sistema',

    },

  });

  const employeeRole = await prisma.role.upsert({

    where: {
      name: 'EMPLOYEE',
    },

    update: {},

    create: {

      name: 'EMPLOYEE',

      description: 'Empleado del sistema',

    },

  });

  // ===================================
  // USUARIO ADMIN
  // ===================================

  const adminUser = await prisma.user.upsert({

    where: {
      username: 'admin',
    },

    update: {},

    create: {

      username: 'admin',

      email: 'admin@test.com',

      password,

      firstName: 'Administrador',

      lastName: 'Sistema',

      status: true,

    },

  });

  // ===================================
  // USER ROLE ADMIN
  // ===================================

  const existsUserRole =
    await prisma.userRole.findFirst({

      where: {

        userId: adminUser.id,

        roleId: adminRole.id,

      },

    });

  if (!existsUserRole) {

    await prisma.userRole.create({

      data: {

        userId: adminUser.id,

        roleId: adminRole.id,

      },

    });

  }

  // ===================================
  // MODULO ADMINISTRACION
  // ===================================

  const adminModule =
    await prisma.module.upsert({

      where: {

        name: 'Administración',

      },

      update: {},

      create: {

        name: 'Administración',

        description:
          'Módulo principal del sistema',

      },

    });

  // ===================================
  // MENU USUARIOS
  // ===================================

  const usersMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Usuarios',

      },

    });

  if (!usersMenu) {

    await prisma.menu.create({

      data: {

        name: 'Usuarios',

        url: '/users',

        order: 1,

        moduleId: adminModule.id,

      },

    });

  }

  // ===================================
  // MENU ROLES
  // ===================================

  const rolesMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Roles',

      },

    });

  if (!rolesMenu) {

    await prisma.menu.create({

      data: {

        name: 'Roles',

        url: '/roles',

        order: 2,

        moduleId: adminModule.id,

      },

    });

  }

  // ===================================
  // ROLE MODULE ADMIN
  // ===================================

  const roleModule =
    await prisma.roleModule.findFirst({

      where: {

        roleId: adminRole.id,

        moduleId: adminModule.id,

      },

    });

  if (!roleModule) {

    await prisma.roleModule.create({

      data: {

        roleId: adminRole.id,

        moduleId: adminModule.id,

      },

    });

  }

  // ===================================
  // ROLE MENU USUARIOS
  // ===================================

  const menuUsers =
    await prisma.menu.findFirst({

      where: {

        name: 'Usuarios',

      },

    });

  if (menuUsers) {

    const roleMenuUsers =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: menuUsers.id,

        },

      });

    if (!roleMenuUsers) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: menuUsers.id,

        },

      });

    }

  }

  // ===================================
  // ROLE MENU ROLES
  // ===================================

  const menuRoles =
    await prisma.menu.findFirst({

      where: {

        name: 'Roles',

      },

    });

  if (menuRoles) {

    const roleMenuRoles =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: menuRoles.id,

        },

      });

    if (!roleMenuRoles) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: menuRoles.id,

        },

      });

    }

  }

  console.log('=================================');
  console.log('Seed ejecutado correctamente');
  console.log('=================================');
  console.log('Usuario: admin');
  console.log('Contraseña: Admin2026!');
  console.log('Roles: ADMIN y EMPLOYEE');
  console.log('=================================');

}

main()
  .catch((error) => {

    console.error(error);

    process.exit(1);

  })
  .finally(async () => {

    await prisma.$disconnect();

  });