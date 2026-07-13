import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RoleModulesService } from './role-modules.service';

@Component({
  selector: 'app-role-modules',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './role-modules.html',
  styleUrl: './role-modules.scss'
})
export class RoleModulesComponent implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(RoleModulesService);

  roles: any[] = [];
  modules: any[] = [];
  assignments: any[] = [];

  form = this.fb.group({

    roleId: ['', Validators.required],

    moduleId: ['', Validators.required]

  });

  ngOnInit(): void {

    this.loadRoles();
    this.loadModules();
    this.loadAssignments();

  }

  loadRoles() {

    this.service.getRoles().subscribe(
      resp => this.roles = resp
    );

  }

  loadModules() {

    this.service.getModules().subscribe(
      resp => this.modules = resp
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