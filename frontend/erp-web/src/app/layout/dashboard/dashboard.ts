import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { MenuService } from '../../auth/services/menu.service';

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

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  modules: ModuleMenu[] = [];
  username = 'Usuario';
  role = '';
  loading = true;
  error = '';

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

  go(url: string) {
    if (url) {
      this.router.navigate([url]);
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}