import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AuthService } from './auth';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  createCliente(cliente: any): Observable<any> {
    return this.http.post(this.apiUrl, cliente, { headers: this.getHeaders() });
  }

  updateCliente(id: number, cliente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, cliente, { headers: this.getHeaders() });
  }

  deleteCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  getMembresias(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/membresias`, { headers: this.getHeaders() });
  }
}