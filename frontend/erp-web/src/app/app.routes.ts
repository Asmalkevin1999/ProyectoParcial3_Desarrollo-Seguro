import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { SelectRoleComponent } from './auth/select-role/select-role';
import { DashboardComponent } from './layout/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

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