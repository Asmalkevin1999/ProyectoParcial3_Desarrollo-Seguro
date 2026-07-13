import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {

  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);

  users: any[] = [];

  editing = false;

  selectedId = '';

  form = this.fb.group({

    username: ['', Validators.required],

    email: ['', [Validators.required, Validators.email]],

    password: ['', Validators.required],

    firstName: ['', Validators.required],

    lastName: ['', Validators.required]

  });

  ngOnInit(): void {

    this.loadUsers();

  }

  loadUsers() {

    this.usersService.getUsers().subscribe({

      next: (resp) => {

        this.users = resp;

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

      this.usersService.update(

        this.selectedId,

        this.form.value

      ).subscribe({

        next: () => {

          this.cancel();

          this.loadUsers();

        }

      });

    } else {

      this.usersService.create(

        this.form.value

      ).subscribe({

        next: () => {

          this.form.reset();

          this.loadUsers();

        }

      });

    }

  }

  edit(user: any) {

    this.editing = true;

    this.selectedId = user.id;

    this.form.patchValue({

      username: user.username,

      email: user.email,

      firstName: user.firstName,

      lastName: user.lastName,

      password: ''

    });

  }

  remove(id: string) {

    if (!confirm('¿Eliminar usuario?')) {

      return;

    }

    this.usersService.delete(id).subscribe({

      next: () => this.loadUsers()

    });

  }

  cancel() {

    this.editing = false;

    this.selectedId = '';

    this.form.reset();

  }

}