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
  isRegisterMode = false;
  username = '';
  email = '';
  fullName = '';
  password = '';
  confirmPassword = '';
  role = 'Empleado';
  loading = false;
  error = '';
  success = '';

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  toggleMode(): void {
    this.isRegisterMode = !this.isRegisterMode;
    this.error = '';
    this.success = '';
  }

  login(): void {
    this.error = '';
    this.success = '';
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

  register(): void {
    this.error = '';
    this.success = '';

    if (!this.username.trim() || !this.email.trim() || !this.fullName.trim() || !this.password) {
      this.error = 'Complete todos los campos de registro.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Las contraseñas no coinciden.';
      return;
    }

    this.loading = true;

    this.auth.register({
      username: this.username.trim(),
      email: this.email.trim(),
      fullName: this.fullName.trim(),
      password: this.password,
      role: this.role,
      isEmployee: true,
    }).subscribe({
      next: () => {
        this.success = 'Registro exitoso. Ahora puede iniciar sesión con sus credenciales.';
        this.isRegisterMode = false;
        this.username = '';
        this.email = '';
        this.fullName = '';
        this.password = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.error = err?.error?.message || err?.message || 'No fue posible registrar al usuario.';
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}