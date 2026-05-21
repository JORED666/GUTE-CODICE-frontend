import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private fotoSubject = new BehaviorSubject<string | null>(null);
  private nombreSubject = new BehaviorSubject<string>('Admin');

  foto$ = this.fotoSubject.asObservable();
  nombre$ = this.nombreSubject.asObservable();

  setFoto(foto: string | null) {
    this.fotoSubject.next(foto);
  }

  setNombre(nombre: string) {
    this.nombreSubject.next(nombre);
  }

  getFoto(): string | null {
    return this.fotoSubject.value;
  }

  getNombre(): string {
    return this.nombreSubject.value;
  }
}