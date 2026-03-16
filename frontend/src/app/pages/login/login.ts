import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})

export class Login {
  credentials = { email: '', password: '' };

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  private authService = inject(Auth);
  private router = inject(Router);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('_id', response._id);
        localStorage.setItem('username', response.username);

        this.router.navigate(['/browse']);
      },
      error: (err) => {
        alert('Invalid email or password.');
      }
    });
  }
}
