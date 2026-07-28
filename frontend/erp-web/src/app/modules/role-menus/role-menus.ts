import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RoleMenusService } from './role-menus.service';

@Component({
  selector: 'app-role-menus',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './role-menus.html',
  styleUrl: './role-menus.scss'
})
export class RoleMenusComponent implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(RoleMenusService);

  roles: any[] = [];
  menus: any[] = [];
  assignments: any[] = [];

  form = this.fb.group({

    roleId: ['', Validators.required],

    menuId: ['', Validators.required]

  });

  ngOnInit(): void {

    this.loadRoles();
    this.loadMenus();
    this.loadAssignments();

  }

  loadRoles() {

    this.service.getRoles().subscribe(
      resp => this.roles = resp
    );

  }

  loadMenus() {

    this.service.getMenus().subscribe(
      resp => this.menus = resp
    );

  }

  loadAssignments() {

    this.service.getAssignments().subscribe(
      resp => this.assignments = resp
    );

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    this.service.assign(
      this.form.value
    ).subscribe(() => {

      this.form.reset();

      this.loadAssignments();

    });

  }

  remove(id: string) {

    if (!confirm('¿Eliminar asignación?')) {

      return;

    }

    this.service.remove(id)
      .subscribe(() => {

        this.loadAssignments();

      });

  }

}