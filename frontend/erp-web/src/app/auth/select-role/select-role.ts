import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { SelectRoleService } from '../services/select-role.service';

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-role.html',
  styleUrl: './select-role.scss',
})
export class SelectRoleComponent {
  roles: any[] = [];
  selectedRoleId = '';
  loading = false;
  error = '';

  constructor(
    private service: SelectRoleService,
    private router: Router,
  ) {}

  ngOnInit() {
    const data = localStorage.getItem('roles');
    if (data) {
      this.roles = JSON.parse(data);
    }
  }

  selectRole(role: any) {
    this.loading = true;
    this.error = '';

    const roleId = role?.id?.trim();

    if (!roleId) {
      this.error = 'No se encontró un rol válido para seleccionar';
      this.loading = false;
      return;
    }

    this.service.selectRole(roleId).subscribe({
      next: (res: any) => {
        localStorage.removeItem('tempToken');
        localStorage.removeItem('roles');
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
        localStorage.setItem('role', res.role);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.error = err?.error?.message || 'No se pudo seleccionar el rol';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}