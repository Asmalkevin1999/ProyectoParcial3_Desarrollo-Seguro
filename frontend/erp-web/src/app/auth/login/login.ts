import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  login() {
    this.error = '';
    this.loading = true;

    this.auth.login({
      username: this.username.trim(),
      password: this.password,
    }).subscribe({
      next: (res: any) => {
        if (!res?.tempToken) {
          this.error = res?.message || 'No se recibió el token temporal del servidor';
          this.loading = false;
          return;
        }

        localStorage.setItem('tempToken', res.tempToken);
        localStorage.setItem('roles', JSON.stringify(res.roles || []));
        localStorage.setItem('username', this.username.trim());
        this.router.navigate(['/select-role']);
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'No fue posible iniciar sesión';
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}