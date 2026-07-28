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

  // ===================================
  // MODULO VENTAS
  // ===================================

  const salesModule =
    await prisma.module.upsert({

      where: {

        name: 'Ventas',

      },

      update: {},

      create: {

        name: 'Ventas',

        description:
          'Gestión de ventas y pedidos',

        icon: '💰',

      },

    });

  // Productos (Ventas)
  const productsSalesMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Productos',

        moduleId: salesModule.id,

      },

    });

  if (!productsSalesMenu) {

    await prisma.menu.create({

      data: {

        name: 'Productos',

        url: '/sales/products',

        order: 1,

        moduleId: salesModule.id,

      },

    });

  }

  // Categorías (Ventas)
  const categoriesSalesMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Categorías',

        moduleId: salesModule.id,

      },

    });

  if (!categoriesSalesMenu) {

    await prisma.menu.create({

      data: {

        name: 'Categorías',

        url: '/sales/categories',

        order: 2,

        moduleId: salesModule.id,

      },

    });

  }

  // Ventas (Pedidos)
  const ordersMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Pedidos',

        moduleId: salesModule.id,

      },

    });

  if (!ordersMenu) {

    await prisma.menu.create({

      data: {

        name: 'Pedidos',

        url: '/sales/orders',

        order: 3,

        moduleId: salesModule.id,

      },

    });

  }

  // ROLE MODULE VENTAS
  const roleSalesModule =
    await prisma.roleModule.findFirst({

      where: {

        roleId: adminRole.id,

        moduleId: salesModule.id,

      },

    });

  if (!roleSalesModule) {

    await prisma.roleModule.create({

      data: {

        roleId: adminRole.id,

        moduleId: salesModule.id,

      },

    });

  }

  // Assign menus to admin role (Ventas)
  const productSalesMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Productos',

        moduleId: salesModule.id,

      },

    });

  if (productSalesMenuDoc) {

    const roleMenuProductsSales =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: productSalesMenuDoc.id,

        },

      });

    if (!roleMenuProductsSales) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: productSalesMenuDoc.id,

        },

      });

    }

  }

  const categoriesSalesMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Categorías',

        moduleId: salesModule.id,

      },

    });

  if (categoriesSalesMenuDoc) {

    const roleMenuCategoriesSales =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: categoriesSalesMenuDoc.id,

        },

      });

    if (!roleMenuCategoriesSales) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: categoriesSalesMenuDoc.id,

        },

      });

    }

  }

  const ordersMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Pedidos',

        moduleId: salesModule.id,

      },

    });

  if (ordersMenuDoc) {

    const roleMenuOrders =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: ordersMenuDoc.id,

        },

      });

    if (!roleMenuOrders) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: ordersMenuDoc.id,

        },

      });

    }

  }

  // ===================================
  // MODULO INVENTARIO
  // ===================================

  const inventoryModule =
    await prisma.module.upsert({

      where: {

        name: 'Inventario',

      },

      update: {},

      create: {

        name: 'Inventario',

        description:
          'Gestión de inventario y stock',

        icon: '📦',

      },

    });

  // Productos (Inventario)
  const productsInvMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Productos',

        moduleId: inventoryModule.id,

      },

    });

  if (!productsInvMenu) {

    await prisma.menu.create({

      data: {

        name: 'Productos',

        url: '/inventory/products',

        order: 1,

        moduleId: inventoryModule.id,

      },

    });

  }

  // Stock
  const stockMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Stock',

        moduleId: inventoryModule.id,

      },

    });

  if (!stockMenu) {

    await prisma.menu.create({

      data: {

        name: 'Stock',

        url: '/inventory/stock',

        order: 2,

        moduleId: inventoryModule.id,

      },

    });

  }

  // Movimientos
  const movementsMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Movimientos',

        moduleId: inventoryModule.id,

      },

    });

  if (!movementsMenu) {

    await prisma.menu.create({

      data: {

        name: 'Movimientos',

        url: '/inventory/movements',

        order: 3,

        moduleId: inventoryModule.id,

      },

    });

  }

  // ROLE MODULE INVENTARIO
  const roleInvModule =
    await prisma.roleModule.findFirst({

      where: {

        roleId: adminRole.id,

        moduleId: inventoryModule.id,

      },

    });

  if (!roleInvModule) {

    await prisma.roleModule.create({

      data: {

        roleId: adminRole.id,

        moduleId: inventoryModule.id,

      },

    });

  }

  // Assign menus to admin role (Inventario)
  const productsInvMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Productos',

        moduleId: inventoryModule.id,

      },

    });

  if (productsInvMenuDoc) {

    const roleMenuProductsInv =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: productsInvMenuDoc.id,

        },

      });

    if (!roleMenuProductsInv) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: productsInvMenuDoc.id,

        },

      });

    }

  }

  const stockMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Stock',

        moduleId: inventoryModule.id,

      },

    });

  if (stockMenuDoc) {

    const roleMenuStock =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: stockMenuDoc.id,

        },

      });

    if (!roleMenuStock) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: stockMenuDoc.id,

        },

      });

    }

  }

  const movementsMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Movimientos',

        moduleId: inventoryModule.id,

      },

    });

  if (movementsMenuDoc) {

    const roleMenuMovements =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: movementsMenuDoc.id,

        },

      });

    if (!roleMenuMovements) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: movementsMenuDoc.id,

        },

      });

    }

  }

  // ===================================
  // MODULO RRHH
  // ===================================

  const hrModule =
    await prisma.module.upsert({

      where: {

        name: 'Recursos Humanos',

      },

      update: {},

      create: {

        name: 'Recursos Humanos',

        description:
          'Gestión de empleados y nómina',

        icon: '👥',

      },

    });

  // Empleados
  const employeesMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Empleados',

        moduleId: hrModule.id,

      },

    });

  if (!employeesMenu) {

    await prisma.menu.create({

      data: {

        name: 'Empleados',

        url: '/hr/employees',

        order: 1,

        moduleId: hrModule.id,

      },

    });

  }

  // Nómina
  const payrollMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Nómina',

        moduleId: hrModule.id,

      },

    });

  if (!payrollMenu) {

    await prisma.menu.create({

      data: {

        name: 'Nómina',

        url: '/hr/payroll',

        order: 2,

        moduleId: hrModule.id,

      },

    });

  }

  // Asistencia
  const attendanceMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Asistencia',

        moduleId: hrModule.id,

      },

    });

  if (!attendanceMenu) {

    await prisma.menu.create({

      data: {

        name: 'Asistencia',

        url: '/hr/attendance',

        order: 3,

        moduleId: hrModule.id,

      },

    });

  }

  // ROLE MODULE RRHH
  const roleHrModule =
    await prisma.roleModule.findFirst({

      where: {

        roleId: adminRole.id,

        moduleId: hrModule.id,

      },

    });

  if (!roleHrModule) {

    await prisma.roleModule.create({

      data: {

        roleId: adminRole.id,

        moduleId: hrModule.id,

      },

    });

  }

  // Assign menus to admin role (RRHH)
  const employeesMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Empleados',

        moduleId: hrModule.id,

      },

    });

  if (employeesMenuDoc) {

    const roleMenuEmployees =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: employeesMenuDoc.id,

        },

      });

    if (!roleMenuEmployees) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: employeesMenuDoc.id,

        },

      });

    }

  }

  const payrollMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Nómina',

        moduleId: hrModule.id,

      },

    });

  if (payrollMenuDoc) {

    const roleMenuPayroll =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: payrollMenuDoc.id,

        },

      });

    if (!roleMenuPayroll) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: payrollMenuDoc.id,

        },

      });

    }

  }

  const attendanceMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Asistencia',

        moduleId: hrModule.id,

      },

    });

  if (attendanceMenuDoc) {

    const roleMenuAttendance =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: attendanceMenuDoc.id,

        },

      });

    if (!roleMenuAttendance) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: attendanceMenuDoc.id,

        },

      });

    }

  }

  // ===================================
  // MODULO USUARIOS
  // ===================================

  const usersModule =
    await prisma.module.upsert({

      where: {

        name: 'Usuarios',

      },

      update: {},

      create: {

        name: 'Usuarios',

        description:
          'Gestión de usuarios del sistema',

        icon: '🧑‍💼',

      },

    });

  // Lista de Usuarios
  const listUsersMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Lista de Usuarios',

        moduleId: usersModule.id,

      },

    });

  if (!listUsersMenu) {

    await prisma.menu.create({

      data: {

        name: 'Lista de Usuarios',

        url: '/users/list',

        order: 1,

        moduleId: usersModule.id,

      },

    });

  }

  // Roles de Usuarios
  const userRolesMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Roles de Usuarios',

        moduleId: usersModule.id,

      },

    });

  if (!userRolesMenu) {

    await prisma.menu.create({

      data: {

        name: 'Roles de Usuarios',

        url: '/users/roles',

        order: 2,

        moduleId: usersModule.id,

      },

    });

  }

  // Permisos
  const permissionsMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Permisos',

        moduleId: usersModule.id,

      },

    });

  if (!permissionsMenu) {

    await prisma.menu.create({

      data: {

        name: 'Permisos',

        url: '/users/permissions',

        order: 3,

        moduleId: usersModule.id,

      },

    });

  }

  // ROLE MODULE USUARIOS
  const roleUsersModule =
    await prisma.roleModule.findFirst({

      where: {

        roleId: adminRole.id,

        moduleId: usersModule.id,

      },

    });

  if (!roleUsersModule) {

    await prisma.roleModule.create({

      data: {

        roleId: adminRole.id,

        moduleId: usersModule.id,

      },

    });

  }

  // Assign menus to admin role (Usuarios)
  const listUsersMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Lista de Usuarios',

        moduleId: usersModule.id,

      },

    });

  if (listUsersMenuDoc) {

    const roleMenuListUsers =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: listUsersMenuDoc.id,

        },

      });

    if (!roleMenuListUsers) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: listUsersMenuDoc.id,

        },

      });

    }

  }

  const userRolesMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Roles de Usuarios',

        moduleId: usersModule.id,

      },

    });

  if (userRolesMenuDoc) {

    const roleMenuUserRoles =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: userRolesMenuDoc.id,

        },

      });

    if (!roleMenuUserRoles) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: userRolesMenuDoc.id,

        },

      });

    }

  }

  const permissionsMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Permisos',

        moduleId: usersModule.id,

      },

    });

  if (permissionsMenuDoc) {

    const roleMenuPermissions =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: permissionsMenuDoc.id,

        },

      });

    if (!roleMenuPermissions) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: permissionsMenuDoc.id,

        },

      });

    }

  }

  // ===================================
  // MODULO PERFIL
  // ===================================

  const profileModule =
    await prisma.module.upsert({

      where: {

        name: 'Perfil',

      },

      update: {},

      create: {

        name: 'Perfil',

        description:
          'Configuración personal del usuario',

        icon: '⚙️',

      },

    });

  // Mi Perfil
  const myProfileMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Mi Perfil',

        moduleId: profileModule.id,

      },

    });

  if (!myProfileMenu) {

    await prisma.menu.create({

      data: {

        name: 'Mi Perfil',

        url: '/profile/me',

        order: 1,

        moduleId: profileModule.id,

      },

    });

  }

  // Configuración
  const settingsMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Configuración',

        moduleId: profileModule.id,

      },

    });

  if (!settingsMenu) {

    await prisma.menu.create({

      data: {

        name: 'Configuración',

        url: '/profile/settings',

        order: 2,

        moduleId: profileModule.id,

      },

    });

  }

  // Cambiar Contraseña
  const changePasswordMenu =
    await prisma.menu.findFirst({

      where: {

        name: 'Cambiar Contraseña',

        moduleId: profileModule.id,

      },

    });

  if (!changePasswordMenu) {

    await prisma.menu.create({

      data: {

        name: 'Cambiar Contraseña',

        url: '/profile/change-password',

        order: 3,

        moduleId: profileModule.id,

      },

    });

  }

  // ROLE MODULE PERFIL
  const roleProfileModule =
    await prisma.roleModule.findFirst({

      where: {

        roleId: adminRole.id,

        moduleId: profileModule.id,

      },

    });

  if (!roleProfileModule) {

    await prisma.roleModule.create({

      data: {

        roleId: adminRole.id,

        moduleId: profileModule.id,

      },

    });

  }

  // Assign menus to admin role (Perfil)
  const myProfileMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Mi Perfil',

        moduleId: profileModule.id,

      },

    });

  if (myProfileMenuDoc) {

    const roleMenuMyProfile =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: myProfileMenuDoc.id,

        },

      });

    if (!roleMenuMyProfile) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: myProfileMenuDoc.id,

        },

      });

    }

  }

  const settingsMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Configuración',

        moduleId: profileModule.id,

      },

    });

  if (settingsMenuDoc) {

    const roleMenuSettings =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: settingsMenuDoc.id,

        },

      });

    if (!roleMenuSettings) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: settingsMenuDoc.id,

        },

      });

    }

  }

  const changePasswordMenuDoc =
    await prisma.menu.findFirst({

      where: {

        name: 'Cambiar Contraseña',

        moduleId: profileModule.id,

      },

    });

  if (changePasswordMenuDoc) {

    const roleMenuChangePassword =
      await prisma.roleMenu.findFirst({

        where: {

          roleId: adminRole.id,

          menuId: changePasswordMenuDoc.id,

        },

      });

    if (!roleMenuChangePassword) {

      await prisma.roleMenu.create({

        data: {

          roleId: adminRole.id,

          menuId: changePasswordMenuDoc.id,

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
  console.log('');
  console.log('Módulos creados:');
  console.log('✅ Administración (Usuarios, Roles)');
  console.log('✅ Ventas (Productos, Categorías, Pedidos)');
  console.log('✅ Inventario (Productos, Stock, Movimientos)');
  console.log('✅ Recursos Humanos (Empleados, Nómina, Asistencia)');
  console.log('✅ Usuarios (Lista, Roles, Permisos)');
  console.log('✅ Perfil (Mi Perfil, Configuración, Cambiar Contraseña)');
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