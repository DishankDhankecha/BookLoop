import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Book {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/books';
  private userApiUrl = 'http://localhost:5000/api/user';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllBooks(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getUserBooks(userId: string): Observable<any> {
    return this.http.get<any>(`${this.userApiUrl}/${userId}`);
  }

  createBook(bookData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, bookData, { headers: this.getHeaders() });
  }

  updateBook(id: string, bookData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, bookData, { headers: this.getHeaders() });
  }

  deleteBook(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getPublicBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/public`);
  } 

  getBookById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getPendingBooks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/pending`, { headers: this.getHeaders() });
  }

  reviewBook(id: string, action: 'approve' | 'reject'): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/admin/review/${id}`, { action }, { headers: this.getHeaders() });
  }
}