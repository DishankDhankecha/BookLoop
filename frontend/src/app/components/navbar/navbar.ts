import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private authService = inject(Auth);

  isLoggedIn = signal<boolean>(false);
  userAvatar = signal<string | null>(null);

  ngOnInit() {
    this.isLoggedIn.set(this.authService.isLoggedIn());

    if (this.isLoggedIn()) {
      const userId = localStorage.getItem('_id');
      if (userId) {
        this.authService.getUserProfile(userId).subscribe({
          next: (user: any) => {
            if (user.avatar) {
              this.userAvatar.set(user.avatar);
            }
          }
        });
      }
    }
  }
}
