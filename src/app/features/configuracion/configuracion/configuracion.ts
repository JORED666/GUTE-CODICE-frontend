import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../../core/services/admin';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-configuracion',
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
  styleUrl: './configuracion.css'
})
export class Configuracion implements OnInit {

  admin = {
    nombre: 'Administrador',
    correo: 'admin@codice.com',
    telefono: '961-000-0000',
    direccion: ''
  };

  fotoPreview: string | null = null;
  mostrarModalPassword = false;

  passwords = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  toastVisible = false;
  toastMensaje = '';
  toastTipo: 'success' | 'error' = 'success';
  private toastTimer: any;

  constructor(
    private router: Router,
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.fotoPreview = this.adminService.getFoto();
    this.admin.nombre = this.adminService.getNombre();
  }

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    clearTimeout(this.toastTimer);
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;
    this.toastTimer = setTimeout(() => this.toastVisible = false, 4000);
  }

  onFotoSeleccionada(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.fotoPreview = e.target.result;
      this.adminService.setFoto(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  guardarPerfil() {
    if (!this.admin.nombre || !this.admin.correo) {
      this.mostrarToast('Nombre y correo son obligatorios', 'error');
      return;
    }
    this.adminService.setNombre(this.admin.nombre);
    this.mostrarToast('Perfil actualizado exitosamente');
  }

  abrirModalPassword() {
    this.passwords = { actual: '', nueva: '', confirmar: '' };
    this.mostrarModalPassword = true;
  }

  cerrarModalPassword() { this.mostrarModalPassword = false; }

  cambiarPassword() {
    if (!this.passwords.actual || !this.passwords.nueva || !this.passwords.confirmar) {
      this.mostrarToast('Por favor llena todos los campos', 'error');
      return;
    }
    if (this.passwords.nueva !== this.passwords.confirmar) {
      this.mostrarToast('Las contraseñas no coinciden', 'error');
      return;
    }
    if (this.passwords.nueva.length < 4) {
      this.mostrarToast('La contraseña debe tener al menos 4 caracteres', 'error');
      return;
    }
    this.cerrarModalPassword();
    this.mostrarToast('Contraseña actualizada exitosamente');
  }

  cerrarSesion() {
    this.authService.logout();
  }
}