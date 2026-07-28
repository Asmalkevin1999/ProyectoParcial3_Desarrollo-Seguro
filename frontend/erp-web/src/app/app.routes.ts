import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SelectRoleComponent } from './auth/select-role/select-role';
import { DashboardComponent } from './layout/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { ModulePageComponent } from './modules/module-page/module-page';

export const routes: Routes = [

  {
    path:'',
    redirectTo:'login',
    pathMatch:'full'
  },

  {
    path:'login',
    component:LoginComponent
  },

  {
    path:'select-role',
    component:SelectRoleComponent
  },

{
  path: 'dashboard',
  component: DashboardComponent,
  canActivate: [authGuard]
},

  {
    path:'users',
    loadComponent:()=>
      import('./modules/users/users')
        .then(m=>m.UsersComponent),
    canActivate:[authGuard]
  },

  {
    path:'users/list',
    component: ModulePageComponent,
    data: { title: 'Lista de Usuarios', subtitle: 'Gestión de usuarios del sistema', icon: '👤' },
    canActivate:[authGuard]
  },

  {
    path:'users/roles',
    component: ModulePageComponent,
    data: { title: 'Roles de Usuarios', subtitle: 'Asignación de roles', icon: '🧩' },
    canActivate:[authGuard]
  },

  {
    path:'users/permissions',
    component: ModulePageComponent,
    data: { title: 'Permisos', subtitle: 'Control de accesos por módulo', icon: '🔐' },
    canActivate:[authGuard]
  },

  {
    path:'roles',
    loadComponent:()=>
      import('./modules/roles/roles')
        .then(m=>m.RolesComponent),
    canActivate:[authGuard]
  },

  {
    path:'menus',
    loadComponent:()=>
      import('./modules/menus/menus')
        .then(m=>m.MenusComponent),
    canActivate:[authGuard]
  },

  {
    path:'modules',
    loadComponent:()=>
      import('./modules/modules/modules')
        .then(m=>m.ModulesComponent),
    canActivate:[authGuard]
  },

  {
    path:'profile',
    loadComponent:()=>
      import('./modules/profile/profile')
        .then(m=>m.ProfileComponent),
    canActivate:[authGuard]
  },

  {
    path:'profile/me',
    component: ModulePageComponent,
    data: { title: 'Mi Perfil', subtitle: 'Datos personales', icon: '🧑' },
    canActivate:[authGuard]
  },

  {
    path:'profile/settings',
    component: ModulePageComponent,
    data: { title: 'Configuración', subtitle: 'Preferencias del usuario', icon: '⚙️' },
    canActivate:[authGuard]
  },

  {
    path:'profile/change-password',
    component: ModulePageComponent,
    data: { title: 'Cambiar Contraseña', subtitle: 'Actualización de credenciales', icon: '🔒' },
    canActivate:[authGuard]
  },

  {
    path:'sales/products',
    component: ModulePageComponent,
    data: { title: 'Productos', subtitle: 'Gestión de productos en ventas', icon: '🧾' },
    canActivate:[authGuard]
  },

  {
    path:'sales/categories',
    component: ModulePageComponent,
    data: { title: 'Categorías', subtitle: 'Clasificación de productos', icon: '🏷️' },
    canActivate:[authGuard]
  },

  {
    path:'sales/orders',
    component: ModulePageComponent,
    data: { title: 'Pedidos', subtitle: 'Seguimiento de ventas', icon: '🛍️' },
    canActivate:[authGuard]
  },

  {
    path:'inventory/products',
    component: ModulePageComponent,
    data: { title: 'Productos', subtitle: 'Gestión de inventario', icon: '📦' },
    canActivate:[authGuard]
  },

  {
    path:'inventory/stock',
    component: ModulePageComponent,
    data: { title: 'Stock', subtitle: 'Control de existencias', icon: '📊' },
    canActivate:[authGuard]
  },

  {
    path:'inventory/movements',
    component: ModulePageComponent,
    data: { title: 'Movimientos', subtitle: 'Historial de entradas y salidas', icon: '🔄' },
    canActivate:[authGuard]
  },

  {
    path:'hr/employees',
    component: ModulePageComponent,
    data: { title: 'Empleados', subtitle: 'Gestión de personal', icon: '👥' },
    canActivate:[authGuard]
  },

  {
    path:'hr/payroll',
    component: ModulePageComponent,
    data: { title: 'Nómina', subtitle: 'Cálculo y control de pagos', icon: '💵' },
    canActivate:[authGuard]
  },

  {
    path:'hr/attendance',
    component: ModulePageComponent,
    data: { title: 'Asistencia', subtitle: 'Registro de asistencias', icon: '🕒' },
    canActivate:[authGuard]
  },

  {
    path:'reservations/hotels',
    component: ModulePageComponent,
    data: { title: 'Hoteles', subtitle: 'Gestión de hoteles', icon: '🏨' },
    canActivate:[authGuard]
  },

  {
    path:'reservations/guests',
    component: ModulePageComponent,
    data: { title: 'Huéspedes', subtitle: 'Gestión de huéspedes', icon: '👤' },
    canActivate:[authGuard]
  },

  {
    path:'reservations/list',
    component: ModulePageComponent,
    data: { title: 'Reservas', subtitle: 'Gestión de reservas', icon: '🗓️' },
    canActivate:[authGuard]
  },

  {
    path:'reservations/stats',
    component: ModulePageComponent,
    data: { title: 'Estadísticas', subtitle: 'Estadísticas de reservas', icon: '📈' },
    canActivate:[authGuard]
  },
  {
  path:'user-roles',
  loadComponent:()=>
    import('./modules/user-roles/user-roles')
      .then(m=>m.UserRolesComponent),
  canActivate:[authGuard]
},

{
  path:'role-modules',
  loadComponent:()=>
    import('./modules/role-modules/role-modules')
      .then(m=>m.RoleModulesComponent),
  canActivate:[authGuard]
},

{
  path:'role-menus',
  loadComponent:()=>
    import('./modules/role-menus/role-menus')
      .then(m=>m.RoleMenusComponent),
  canActivate:[authGuard]
},

];