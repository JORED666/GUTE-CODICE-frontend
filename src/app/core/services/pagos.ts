import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class PagosService {

  private apiUrl = `${environment.apiUrl}/caja`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getPagos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  getResumen(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resumen`, { headers: this.getHeaders() });
  }

  createPago(pago: any): Observable<any> {
    return this.http.post(this.apiUrl, pago, { headers: this.getHeaders() });
  }

  deletePago(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}