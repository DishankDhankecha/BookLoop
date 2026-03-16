import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/auth';

  register(userData: any) {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('_id', res._id);
          localStorage.setItem('username', res.username);
        }
      })
    );
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('_id', res._id);
          localStorage.setItem('username', res.username);
        }
      })
    );
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    localStorage.removeItem('username');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserProfile(id: string) {
    return this.http.get(`http://localhost:5000/api/user/${id}`);
  }

  updateUserProfile(id: string, data: any) {
    return this.http.put(`${this.apiUrl.replace('/auth', '/user')}/${id}`, data);
  }

  updateUserPassword(id: string, data: any) {
    return this.http.put(`${this.apiUrl.replace('/auth', '/user')}/${id}/password`, data);
  }

  getGlobalStats() {
    return this.http.get(`http://localhost:5000/api/user/stats/global`);
  }
}