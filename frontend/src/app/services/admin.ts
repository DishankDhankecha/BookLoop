import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Admin {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/admin';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getDashboardData() {
    return this.http.get<any>(`${this.apiUrl}/dashboard`, { headers: this.getHeaders() });
  }

  deleteUser(id: string) {
    return this.http.delete<any>(`${this.apiUrl}/users/${id}`, { headers: this.getHeaders() });
  }
}
