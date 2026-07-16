import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-module-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './module-page.html',
})
export class ModulePageComponent implements OnInit {
  title = 'Módulo';
  subtitle = 'Contenido del módulo';
  icon = '📦';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.title = data['title'] ?? this.title;
      this.subtitle = data['subtitle'] ?? this.subtitle;
      this.icon = data['icon'] ?? this.icon;
    });
  }
}
