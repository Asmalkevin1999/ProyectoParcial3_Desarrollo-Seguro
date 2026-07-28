import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { RolesService } from './roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './roles.html',
  styleUrl: './roles.scss'
})
export class RolesComponent implements OnInit {

  private fb = inject(FormBuilder);
  private rolesService = inject(RolesService);

  roles: any[] = [];

  editing = false;

  selectedId = '';

  form = this.fb.group({

    name: ['', Validators.required],

    description: ['']

  });

  ngOnInit(): void {

    this.loadRoles();

  }

  loadRoles() {

    this.rolesService.getRoles().subscribe({

      next: (resp) => {

        this.roles = resp;

      },

      error: console.error

    });

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.editing) {

      this.rolesService.update(

        this.selectedId,

        this.form.value

      ).subscribe({

        next: () => {

          this.cancel();

          this.loadRoles();

        }

      });

    } else {

      this.rolesService.create(

        this.form.value

      ).subscribe({

        next: () => {

          this.form.reset();

          this.loadRoles();

        }

      });

    }

  }

  edit(role: any) {

    this.editing = true;

    this.selectedId = role.id;

    this.form.patchValue({

      name: role.name,

      description: role.description

    });

  }

  remove(id: string) {

    if (!confirm('¿Eliminar este rol?')) {

      return;

    }

    this.rolesService.delete(id).subscribe({

      next: () => this.loadRoles()

    });

  }

  cancel() {

    this.editing = false;

    this.selectedId = '';

    this.form.reset();

  }

}