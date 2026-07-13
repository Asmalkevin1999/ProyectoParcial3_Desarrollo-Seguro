import {
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ProfileService } from './profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class ProfileComponent implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(ProfileService);

  profile: any;

  form = this.fb.group({

    username: [''],

    email: ['', Validators.email],

    firstName: [''],

    lastName: ['']

  });

  passwordForm = this.fb.group({

    currentPassword: ['', Validators.required],

    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]

  });

  ngOnInit(): void {

    this.loadProfile();

  }

  loadProfile() {

    this.service
      .getProfile()
      .subscribe({

        next: (resp) => {

          this.profile = resp;

          this.form.patchValue({

            username: resp.username,

            email: resp.email,

            firstName: resp.firstName,

            lastName: resp.lastName

          });

        }

      });

  }

  save() {

    if (this.form.invalid) {
      return;
    }

    this.service
      .update(this.form.value)
      .subscribe(() => {

        alert('Perfil actualizado');

      });

  }

  changePassword() {

    if (this.passwordForm.invalid) {
      return;
    }

    this.service
      .changePassword(
        this.passwordForm.value
      )
      .subscribe(() => {

        alert('Contraseña actualizada');

        this.passwordForm.reset();

      });

  }

}