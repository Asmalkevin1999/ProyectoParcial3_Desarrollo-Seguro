import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MenuService } from '../../auth/services/menu.service';
import { UsersComponent } from '../../modules/users/users';
import { RolesComponent } from '../../modules/roles/roles';
import { MenusComponent } from '../../modules/menus/menus';
import { ModulesComponent } from '../../modules/modules/modules';
import { ProfileComponent } from '../../modules/profile/profile';

interface MenuItem {
  id: string;
  name: string;
  url: string;
  icon?: string;
  order: number;
  parentId: string | null;
  children?: MenuItem[];
}

interface ModuleMenu {
  id: string;
  name: string;
  description: string;
  icon?: string;
  menus: MenuItem[];
}

interface MetricCard {
  label: string;
  value: string;
  change: string;
}

interface OrderRow {
  id: string;
  customer: string;
  total: string;
  status: string;
}

interface SpecGroup {
  title: string;
  items: string[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, UsersComponent, RolesComponent, MenusComponent, ModulesComponent, ProfileComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  modules: ModuleMenu[] = [];
  username = 'Usuario';
  role = '';
  loading = true;
  error = '';
  expandedModuleId = '';
  expandedMenuIds: string[] = [];
  selectedMenu: MenuItem | null = null;
  activeView: 'dashboard' | 'users' | 'roles' | 'menus' | 'modules' | 'profile' = 'dashboard';
  workspaceTitle = 'Panel de ventas';
  workspaceSubtitle = 'Operaciones del microservicio de ventas';
  workspaceIcon = '🛍️';
  workspaceSummary = 'Monitorea pedidos, productos y rendimiento comercial desde una vista operativa y profesional.';
  workspaceBullets: string[] = [];
  workspaceMicroservice = 'sales-service';
  metrics: MetricCard[] = [];
  recentOrders: OrderRow[] = [];
  implementationNotes: string[] = [];
  endpointSpecs: SpecGroup[] = [];

  constructor(
    private menuService: MenuService,
    private router: Router,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? 'Usuario';
    this.role = localStorage.getItem('role') ?? '';
    this.loadMenu();
  }

  loadMenu() {
    this.loading = true;
    this.error = '';

    this.menuService.getMyMenu().subscribe({
      next: (res: any) => {
        const modules = Array.isArray(res) ? res : [];
        this.modules = modules.map((module: any) => ({
          ...module,
          menus: this.buildMenuTree(module.menus || []),
        }));

        if (this.modules.length) {
          const firstModule = this.modules[0];
          const firstMenu = firstModule.menus?.[0];
          if (firstMenu) {
            this.expandedModuleId = firstModule.id;
            this.openWorkspace(firstMenu, firstModule);
          }
        }

        this.cd.detectChanges();
      },
      error: () => {
        this.error = 'No fue posible cargar el menú del rol seleccionado';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  buildMenuTree(menus: MenuItem[]): MenuItem[] {
    const map = new Map<string, MenuItem>();
    const roots: MenuItem[] = [];

    menus.forEach((menu) => {
      map.set(menu.id, {
        ...menu,
        children: [],
      });
    });

    map.forEach((menu) => {
      if (menu.parentId) {
        const parent = map.get(menu.parentId);
        if (parent) {
          parent.children!.push(menu);
          return;
        }
      }
      roots.push(menu);
    });

    const sortTree = (items: MenuItem[]) => {
      items.sort((a, b) => a.order - b.order);
      items.forEach((item) => {
        if (item.children?.length) {
          sortTree(item.children);
        }
      });
    };

    sortTree(roots);
    return roots;
  }

  toggleModule(module: ModuleMenu) {
    this.expandedModuleId = this.expandedModuleId === module.id ? '' : module.id;
  }

  toggleMenu(menu: MenuItem, module: ModuleMenu) {
    if (menu.children?.length) {
      this.expandedMenuIds = this.expandedMenuIds.includes(menu.id)
        ? this.expandedMenuIds.filter((id) => id !== menu.id)
        : [...this.expandedMenuIds, menu.id];
      return;
    }

    this.openWorkspace(menu, module);
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenuIds.includes(menuId);
  }

  openWorkspace(menu: MenuItem, module: ModuleMenu) {
    this.selectedMenu = menu;
    this.expandedModuleId = module.id;

    const routePath = (menu.url || '').replace(/^\/+/, '').split('/')[0] || module.id;
    this.activeView = this.getComponentView(routePath);
    const microservice = this.getMicroservice(routePath);
    const bullets = this.getWorkspaceBullets(routePath, module.name, menu.name);
    const metrics = this.getMetrics(routePath);
    const recentOrders = this.getRecentOrders(routePath);
    const implementationNotes = this.getImplementationNotes(routePath);
    const endpointSpecs = this.getEndpointSpecs(routePath);

    this.workspaceTitle = menu.name === 'Dashboard' ? 'Panel de ventas' : menu.name;
    this.workspaceSubtitle = `${module.name} • ${menu.name}`;
    this.workspaceIcon = menu.icon || module.icon || '🛍️';
    this.workspaceSummary = this.getWorkspaceSummary(routePath, module.name, menu.name);
    this.workspaceBullets = bullets;
    this.workspaceMicroservice = microservice;
    this.metrics = metrics;
    this.recentOrders = recentOrders;
    this.implementationNotes = implementationNotes;
    this.endpointSpecs = endpointSpecs;
  }

  private getWorkspaceSummary(routePath: string, moduleName: string, menuName: string): string {
    const summaries: Record<string, string> = {
      users: `Gestiona usuarios, perfiles y accesos del sistema desde ${moduleName}.`,
      roles: `Administra los roles y permisos que definen el acceso a ${menuName}.`,
      menus: `Define la estructura del menú y los puntos de navegación del ERP.`,
      modules: `Controla los módulos funcionales y su relación con los servicios del sistema.`,
      sales: `Coordina catálogo, pedidos y seguimiento comercial en tiempo real para la tienda.`,
      inventory: `Controla inventario, stock y movimientos del almacén con trazabilidad.`,
      hr: `Gestiona personal, nómina y asistencia del equipo.`,
      profile: `Muestra la información personal y los ajustes del usuario actual.`,
    };

    return summaries[routePath] || `Contenido esperado para ${menuName} dentro de ${moduleName}.`;
  }

  private getWorkspaceBullets(routePath: string, moduleName: string, menuName: string): string[] {
    const bulletsByRoute: Record<string, string[]> = {
      users: [
        'Listado de usuarios del sistema',
        'Asignación de roles y permisos',
        'Control de estados y accesos',
      ],
      roles: [
        'Creación y edición de roles',
        'Definición de permisos por módulo',
        'Administración de seguridad',
      ],
      menus: [
        'Estructura jerárquica del menú',
        'Asociación de módulos y submenús',
        'Visibilidad según rol activo',
      ],
      modules: [
        'Registro documental de módulos del ERP',
        'Relación entre funcionalidades y servicios',
        'Mantenimiento del catálogo funcional',
      ],
      sales: [
        'Catálogo de productos y categorías',
        'Registro de pedidos y ventas',
        'Seguimiento comercial del negocio',
      ],
      inventory: [
        'Control de stock y existencias',
        'Movimientos de entradas y salidas',
        'Gestión del almacén y productos',
      ],
      hr: [
        'Administración de empleados',
        'Control de nómina y asistencia',
        'Gestión del equipo de trabajo',
      ],
      profile: [
        'Datos personales del usuario',
        'Preferencias y seguridad',
        'Cambio de contraseña y configuración',
      ],
    };

    return bulletsByRoute[routePath] || [
      `Vista preparada para ${menuName}`,
      `Se integra con ${moduleName}`,
      'Se muestra dentro del workspace del dashboard',
    ];
  }

  private getMetrics(routePath: string): MetricCard[] {
    if (routePath === 'sales') {
      return [
        { label: 'Ventas del día', value: '$24,850', change: '+12.4%' },
        { label: 'Órdenes activas', value: '184', change: '+8.2%' },
        { label: 'Ticket promedio', value: '$135', change: '+3.1%' },
      ];
    }

    if (routePath === 'inventory') {
      return [
        { label: 'Stock crítico', value: '14 SKU', change: '-2' },
        { label: 'Movimientos', value: '328', change: '+11%' },
        { label: 'Rotación', value: '4.8x', change: '+0.4x' },
      ];
    }

    return [
      { label: 'Operaciones', value: '96%', change: '+4%' },
      { label: 'Disponibilidad', value: '99.9%', change: '+0.1%' },
      { label: 'SLA', value: '24/7', change: 'OK' },
    ];
  }

  private getRecentOrders(routePath: string): OrderRow[] {
    if (routePath === 'sales') {
      return [
        { id: '#1042', customer: 'Ana Morales', total: '$1,250', status: 'Pagado' },
        { id: '#1043', customer: 'Carlos Ruiz', total: '$840', status: 'En proceso' },
        { id: '#1044', customer: 'Elena Torres', total: '$2,310', status: 'Pendiente' },
      ];
    }

    return [
      { id: '#1001', customer: 'Cliente general', total: '$540', status: 'Activo' },
      { id: '#1002', customer: 'Cliente general', total: '$790', status: 'Activo' },
      { id: '#1003', customer: 'Cliente general', total: '$420', status: 'Activo' },
    ];
  }

  private getImplementationNotes(routePath: string): string[] {
    if (routePath === 'sales') {
      return [
        'Patrón de auditoría y estado global para todas las entidades del modelo.',
        'Soft deletes automáticos para evitar filtrar registros inactivos por error.',
        'Auditoría de tablas pivote para controlar permisos y asociaciones entre usuarios, roles y módulos.',
        'Trazabilidad de creación, actualización y eliminación lógica en toda la operación.',
      ];
    }

    return [
      'Diseño modular orientado a microservicios.',
      'Seguridad de acceso y trazabilidad integrada.',
      'Observabilidad para operaciones críticas.',
    ];
  }

  private getEndpointSpecs(routePath: string): SpecGroup[] {
    if (routePath === 'sales') {
      return [
        {
          title: 'Autenticación',
          items: [
            'POST /api/auth/login para validar credenciales y devolver roles disponibles.',
            'POST /api/auth/select-role para emitir el token definitivo.',
          ],
        },
        {
          title: 'Usuarios y roles',
          items: [
            'GET /api/users y GET /api/users/{id} con filtros por estado activo.',
            'POST /api/roles y POST /api/roles/{id}/users para asignar permisos.',
          ],
        },
        {
          title: 'Módulos y menús',
          items: [
            'GET /api/modules y GET /api/menus/tree para renderizar navegación por rol.',
            'POST /api/roles/{id}/modules y POST /api/roles/{id}/menus para vincular acceso.',
          ],
        },
      ];
    }

    return [
      {
        title: 'Operación general',
        items: [
          'Endpoints protegidos por validación de token.',
          'Gestión de estado activo/inactivo para cada entidad.',
        ],
      },
    ];
  }

  private getComponentView(routePath: string): 'dashboard' | 'users' | 'roles' | 'menus' | 'modules' | 'profile' {
    switch (routePath) {
      case 'users':
        return 'users';
      case 'roles':
        return 'roles';
      case 'menus':
        return 'menus';
      case 'modules':
        return 'modules';
      case 'profile':
        return 'profile';
      default:
        return 'dashboard';
    }
  }

  private getMicroservice(routePath: string): string {
    const microservices: Record<string, string> = {
      users: 'master-service',
      roles: 'master-service',
      menus: 'master-service',
      modules: 'master-service',
      sales: 'sales-service',
      inventory: 'inventory-service',
      hr: 'hr-service',
      profile: 'master-service',
    };

    return microservices[routePath] || 'gateway';
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}