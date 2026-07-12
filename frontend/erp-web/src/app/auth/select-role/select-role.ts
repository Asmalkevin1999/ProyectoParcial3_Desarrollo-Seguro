import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { SelectRoleService } from '../services/select-role.service';

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-role.html',
  styleUrl: './select-role.scss'
})
export class SelectRoleComponent {

  roles: any[] = [];

  constructor(
    private service: SelectRoleService,
    private router: Router
  ) {}

  ngOnInit() {

    const data = localStorage.getItem('roles');

    if (data) {
      this.roles = JSON.parse(data);
    }

  }

  selectRole(role: any) {

    this.service.selectRole(role.id)

      .subscribe({

        next: (res: any) => {

          localStorage.removeItem('tempToken');

          localStorage.removeItem('roles');

          localStorage.setItem(
            'accessToken',
            res.accessToken
          );

          localStorage.setItem(
            'refreshToken',
            res.refreshToken
          );

          localStorage.setItem(
            'role',
            res.role
          );

          this.router.navigate([
            '/dashboard'
          ]);

        },

        error: (err) => {

          console.log(err);

        }

      });

  }

}