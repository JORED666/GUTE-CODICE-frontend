import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

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

  constructor(private router: Router, private authService: AuthService) {}

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

    this.authService.login(this.correo, this.contrasena).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.cargando = false;
        this.errorMsg = err.error?.message || 'Correo o contraseña incorrectos';
      }
    });
  }
}