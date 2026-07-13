import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ModulesService } from './modules.service';

@Component({
  selector: 'app-modules',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './modules.html',
  styleUrl: './modules.scss'
})
export class ModulesComponent implements OnInit {

  private fb = inject(FormBuilder);
  private moduleService = inject(ModulesService);

  modules: any[] = [];

  editing = false;

  selectedId = '';

  form = this.fb.group({

    name: ['', Validators.required],

    icon: [''],

    route: ['', Validators.required]

  });

  ngOnInit(): void {

    this.loadModules();

  }

  loadModules() {

    this.moduleService.getModules().subscribe({

      next: data => this.modules = data,

      error: console.error

    });

  }

  save() {

    if (this.form.invalid) {

      this.form.markAllAsTouched();

      return;

    }

    if (this.editing) {

      this.moduleService.update(

        this.selectedId,

        this.form.value

      ).subscribe(() => {

        this.cancel();

        this.loadModules();

      });

    } else {

      this.moduleService.create(

        this.form.value

      ).subscribe(() => {

        this.form.reset();

        this.loadModules();

      });

    }

  }

  edit(module: any) {

    this.editing = true;

    this.selectedId = module.id;

    this.form.patchValue({

      name: module.name,

      icon: module.icon,

      route: module.route

    });

  }

  remove(id: string) {

    if (!confirm('¿Eliminar módulo?')) {

      return;

    }

    this.moduleService.delete(id).subscribe(() => {

      this.loadModules();

    });

  }

  cancel() {

    this.editing = false;

    this.selectedId = '';

    this.form.reset();

  }

}