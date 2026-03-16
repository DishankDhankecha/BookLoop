import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {
  userData = {
    username: '',
    email: '',
    password: '',
    location: {
      city: '',
      state: ''
    }
  };

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  private authService = inject(Auth);
  private router = inject(Router);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    if (!this.userData.username || !this.userData.email || !this.userData.password || !this.userData.location.city || !this.userData.location.state) {
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.authService.register(this.userData).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Registration failed. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
