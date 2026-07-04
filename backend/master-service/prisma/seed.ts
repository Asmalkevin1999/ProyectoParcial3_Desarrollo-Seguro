import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {

  const password = await bcrypt.hash(
    'Admin2026!',
    12
  );

  // ==========================
  // ROL ADMIN
  // ==========================

  const role = await prisma.role.upsert({

    where: {
      name: 'ADMIN'
    },

    update: {},

    create: {

      name: 'ADMIN',

      description: 'Administrador del sistema'

    }

  });

  // ==========================
  // USUARIO ADMIN
  // ==========================

  const user = await prisma.user.upsert({

    where: {
      username: 'admin'
    },

    update: {},

    create: {

      username: 'admin',

      email: 'admin@test.com',

      password,

      firstName: 'Admin',

      lastName: 'Master'

    }

  });

  // ==========================
  // USER ROLE
  // ==========================

  const userRole = await prisma.userRole.findFirst({

    where: {

      userId: user.id,

      roleId: role.id

    }

  });

  if (!userRole) {

    await prisma.userRole.create({

      data: {

        userId: user.id,

        roleId: role.id

      }

    });

  }

  // ==========================
  // MODULO ADMINISTRACION
  // ==========================

  const moduleAdmin = await prisma.module.upsert({

    where: {

      name: 'Administración'

    },

    update: {},

    create: {

      name: 'Administración',

      description: 'Modulo principal'

    }

  });

  // ==========================
  // MENU USUARIOS
  // ==========================

  const menuUsers = await prisma.menu.findFirst({

    where: {

      name: 'Usuarios'

    }

  });

  if (!menuUsers) {

    await prisma.menu.create({

      data: {

        name: 'Usuarios',

        url: '/users',

        order: 1,

        moduleId: moduleAdmin.id

      }

    });

  }

  // ==========================
  // MENU ROLES
  // ==========================

  const menuRoles = await prisma.menu.findFirst({

    where: {

      name: 'Roles'

    }

  });

  if (!menuRoles) {

    await prisma.menu.create({

      data: {

        name: 'Roles',

        url: '/roles',

        order: 2,

        moduleId: moduleAdmin.id

      }

    });

  }

  console.log('Administrador creado');
  console.log('Menus creados');
}

main()
  .catch((error) => {

    console.error(error);

    process.exit(1);

  })
  .finally(async () => {

    await prisma.$disconnect();

  });