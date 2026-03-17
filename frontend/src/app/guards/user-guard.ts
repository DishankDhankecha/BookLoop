import { inject } from '@angular/core/primitives/di';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  const role = localStorage.getItem('role');

  if (authService.isLoggedIn() && role !== 'admin') {
    return true;
  }

  if (role === 'admin') {
    router.navigate(['/admin']);
    return false;
  }

  router.navigate(['/login']);
  return false;
};
