import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-clientes',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.css'
})
export class ListaClientes {

  busqueda = '';
  modalAbierta = false;
  paso = 1;
  modalEditarAbierta = false;
  clienteEditando: any = null;
  modalEliminarAbierta = false;
  clienteAEliminar: any = null;

  // ── Toast ──────────────────────────────────────
  toastVisible = false;
  toastMensaje = '';
  toastTipo: 'success' | 'error' = 'success';
  private toastTimer: any;

  mostrarToast(mensaje: string, tipo: 'success' | 'error' = 'success') {
    clearTimeout(this.toastTimer);
    this.toastMensaje = mensaje;
    this.toastTipo = tipo;
    this.toastVisible = true;
    this.toastTimer = setTimeout(() => this.toastVisible = false, 4000);
  }
  // ──────────────────────────────────────────────

  nuevoCliente = {
    nombre: '', apellido: '', telefono: '', correo: '', membresia: '', status: 'activo'
  };

  membresias = [
    { tipo: 'Semanal',   duracion: '7 días',   precio: '$150' },
    { tipo: 'Quincenal', duracion: '15 días',  precio: '$250' },
    { tipo: 'Mensual',   duracion: '30 días',  precio: '$400' },
    { tipo: 'Anual',     duracion: '365 días', precio: '$3,500' },
  ];

  statuses = ['activo', 'inactivo', 'suspendido'];

  clientes = [
    { id: 1, nombre: 'Juan',   apellido: 'Pérez',     telefono: '961-100-0001', correo: 'juan@email.com',   membresia: 'Mensual',   vence: '15 Jun 2026', status: 'activo' },
    { id: 2, nombre: 'María',  apellido: 'García',    telefono: '961-100-0002', correo: 'maria@email.com',  membresia: 'Quincenal', vence: '01 Jun 2026', status: 'activo' },
    { id: 3, nombre: 'Carlos', apellido: 'López',     telefono: '961-100-0003', correo: 'carlos@email.com', membresia: 'Semanal',   vence: '25 May 2026', status: 'inactivo' },
    { id: 4, nombre: 'Ana',    apellido: 'Martínez',  telefono: '961-100-0004', correo: 'ana@email.com',    membresia: 'Anual',     vence: '01 Ene 2027', status: 'activo' },
    { id: 5, nombre: 'Luis',   apellido: 'Rodríguez', telefono: '961-100-0005', correo: 'luis@email.com',   membresia: 'Mensual',   vence: '10 Jun 2026', status: 'activo' },
    { id: 6, nombre: 'Sofía',  apellido: 'Torres',    telefono: '961-100-0006', correo: 'sofia@email.com',  membresia: 'Quincenal', vence: '05 Jun 2026', status: 'suspendido' },
  ];

  get clientesFiltrados() {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.clientes;
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q) ||
      c.telefono.includes(q) ||
      c.membresia.toLowerCase().includes(q)
    );
  }

  abrirModal() {
    this.nuevoCliente = { nombre: '', apellido: '', telefono: '', correo: '', membresia: '', status: 'activo' };
    this.paso = 1;
    this.modalAbierta = true;
  }

  cerrarModal() { this.modalAbierta = false; this.paso = 1; }

  siguientePaso() {
    if (!this.nuevoCliente.nombre || !this.nuevoCliente.apellido) {
      this.mostrarToast('Por favor llena nombre y apellido', 'error');
      return;
    }
    this.paso = 2;
  }

  seleccionarMembresia(tipo: string) { this.nuevoCliente.membresia = tipo; }

  guardar() {
    if (!this.nuevoCliente.membresia) {
      this.mostrarToast('Por favor selecciona una membresía', 'error');
      return;
    }
    this.clientes.push({
      id: this.clientes.length + 1,
      nombre: this.nuevoCliente.nombre,
      apellido: this.nuevoCliente.apellido,
      telefono: this.nuevoCliente.telefono,
      correo: this.nuevoCliente.correo,
      membresia: this.nuevoCliente.membresia,
      vence: '—',
      status: 'activo'
    });
    this.cerrarModal();
    this.mostrarToast(`${this.nuevoCliente.nombre} ${this.nuevoCliente.apellido} se ha registrado exitosamente`);
  }

  abrirEditar(cliente: any) {
    this.clienteEditando = { ...cliente };
    this.modalEditarAbierta = true;
  }

  cerrarEditar() { this.modalEditarAbierta = false; this.clienteEditando = null; }

  guardarEdicion() {
    if (!this.clienteEditando.nombre || !this.clienteEditando.apellido) {
      this.mostrarToast('Nombre y apellido son obligatorios', 'error');
      return;
    }
    const idx = this.clientes.findIndex(c => c.id === this.clienteEditando.id);
    if (idx !== -1) this.clientes[idx] = { ...this.clienteEditando };
    this.cerrarEditar();
    this.mostrarToast(`${this.clienteEditando.nombre} ${this.clienteEditando.apellido} se ha actualizado exitosamente`);
  }

  confirmarEliminar(cliente: any) {
    this.clienteAEliminar = cliente;
    this.modalEliminarAbierta = true;
  }

  cerrarEliminar() { this.modalEliminarAbierta = false; this.clienteAEliminar = null; }

  eliminar() {
    const nombre = `${this.clienteAEliminar.nombre} ${this.clienteAEliminar.apellido}`;
    this.clientes = this.clientes.filter(c => c.id !== this.clienteAEliminar.id);
    this.cerrarEliminar();
    this.mostrarToast(`${nombre} se ha eliminado exitosamente`);
  }
}