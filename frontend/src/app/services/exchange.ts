import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Exchange {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/exchanges';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  requestExchange(bookId: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { bookId }, { headers: this.getHeaders() });
  }

  getIncomingRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/incoming`, { headers: this.getHeaders() });
  }

  getOutgoingRequests(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/outgoing`, { headers: this.getHeaders() });
  }

  updateRequestStatus(exchangeId: string, status: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${exchangeId}`, { status }, { headers: this.getHeaders() });
  }  

  deleteExchangeRequest(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}
