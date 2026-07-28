import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { MenusService } from './menus.service';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './menus.html',
  styleUrl: './menus.scss'
})
export class MenusComponent implements OnInit {

  private fb = inject(FormBuilder);
  private menuService = inject(MenusService);

  menus: any[] = [];

  editing = false;

  selectedId = '';

  form = this.fb.group({

    name: ['', Validators.required],

    path: ['', Validators.required],

    icon: [''],

    order: [1]

  });

  ngOnInit(): void {

    this.loadMenus();

  }

  loadMenus() {

    this.menuService.getMenus().subscribe({

      next: (data) => this.menus = data,

      error: console.error

    });

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.editing) {

      this.menuService.update(

        this.selectedId,

        this.form.value

      ).subscribe(() => {

        this.cancel();

        this.loadMenus();

      });

    } else {

      this.menuService.create(

        this.form.value

      ).subscribe(() => {

        this.form.reset({ order: 1 });

        this.loadMenus();

      });

    }

  }

  edit(menu: any) {

    this.editing = true;

    this.selectedId = menu.id;

    this.form.patchValue(menu);

  }

  remove(id: string) {

    if (!confirm('¿Eliminar menú?')) {

      return;

    }

    this.menuService.delete(id).subscribe(() => {

      this.loadMenus();

    });

  }

  cancel() {

    this.editing = false;

    this.selectedId = '';

    this.form.reset({ order: 1 });

  }

}