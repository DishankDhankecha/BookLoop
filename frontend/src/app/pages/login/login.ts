import { Component, inject, signal } from '@angular/core';
import { Auth } from '../../services/auth';
import { Router , RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink , FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  credentials = { email : '' , password : '' };

  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  private auth = inject(Auth);
  private router = inject(Router);

  togglePassword(){
    this.showPassword.update(v => !v);
  }

  onSubmit(){
    if(!this.credentials.email || !this.credentials.password){
      this.errorMessage.set('Please fill in all fields.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.auth.login(this.credentials).subscribe({
      next: (res) => {
        this.auth.saveToken(res.token);
        this.router.navigate(['/']);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Login failed. Please try again.');
        this.isLoading.set(false);
      }
    }); 
  }
}
