import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { UserRolesService } from './user-roles.service';

@Component({
  selector: 'app-user-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './user-roles.html',
  styleUrl: './user-roles.scss'
})
export class UserRolesComponent implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(UserRolesService);

  users: any[] = [];
  roles: any[] = [];
  assignments: any[] = [];

  form = this.fb.group({

    userId: ['', Validators.required],
    roleId: ['', Validators.required]

  });

  ngOnInit(): void {

    this.loadUsers();
    this.loadRoles();
    this.loadAssignments();

  }

  loadUsers() {
    this.service.getUsers().subscribe(
      resp => this.users = resp
    );
  }

  loadRoles() {
    this.service.getRoles().subscribe(
      resp => this.roles = resp
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

    this.service.remove(id).subscribe(() => {
      this.loadAssignments();
    });

  }

}