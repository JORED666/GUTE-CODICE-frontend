import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  correo = '';
  contrasena = '';
  mostrarPassword = false;
  cargando = false;
  errorMsg = '';

  constructor(private router: Router) {}

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  iniciarSesion() {
    this.errorMsg = '';

    if (!this.correo || !this.contrasena) {
      this.errorMsg = 'Por favor llena todos los campos';
      return;
    }

    this.cargando = true;

    setTimeout(() => {
      this.cargando = false;
      if (this.correo === 'admin@codice.com' && this.contrasena === '1234') {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMsg = 'Correo o contraseña incorrectos';
      }
    }, 1500);
  }
}