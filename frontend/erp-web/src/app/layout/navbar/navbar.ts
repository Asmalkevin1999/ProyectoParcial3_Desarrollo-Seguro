import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {

  username = localStorage.getItem('username') || 'Usuario';

  logout() {

    localStorage.clear();

    location.href = "/login";

  }

}