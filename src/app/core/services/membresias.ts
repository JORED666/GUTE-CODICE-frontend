import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class MembresiasService {

  private apiUrl = `${environment.apiUrl}/membresias`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getMembresias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  updateMembresia(id: number, membresia: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, membresia, { headers: this.getHeaders() });
  }
}