import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5000/api/auth';

  login(credentials : any ) : Observable<any> {
    return this.http.post(`${this.apiUrl}/login` , credentials);
  }

  saveToken(token : string){
    localStorage.setItem('token' , token);
  }

  register(userData : any) : Observable<any> {
    return this.http.post(`${this.apiUrl}/register` , userData);
  }
}