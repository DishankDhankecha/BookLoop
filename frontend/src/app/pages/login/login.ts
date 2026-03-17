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
    this.isLoading.set(true);

    this.authService.login(this.credentials).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('_id', response._id);
        localStorage.setItem('username', response.username);
        localStorage.setItem('role', response.role);

        this.isLoading.set(false);

        if (response.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/browse']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Invalid email or password.');
        alert('Invalid email or password.');
      }
    });
  }
}
