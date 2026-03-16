import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})

export class Sidebar {

  private authService = inject(Auth);
  private router = inject(Router);

  links = [
    { name: 'Dashboard', icon: 'grid_view', route: '/dashboard' },
    { name: 'Browse', icon: 'search', route: '/browse' },
    { name: 'Exchanges', icon: 'swap_horiz', route: '/exchanges' },
    { name: 'My Library', icon: 'book', route: '/my-library' },
  ];

  logout() {
    this.authService .logout();
    this.router.navigate(['/login']);
  }
}
