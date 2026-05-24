import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../core/services/clientes';

@Component({
  selector: 'app-lista-clientes',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './lista-clientes.html',
  styleUrl: './lista-clientes.css'
})
export class ListaClientes implements OnInit {

  busqueda = '';
  cargando = false;
  modalAbierta = false;
  paso = 1;
  modalEditarAbierta = false;
  clienteEditando: any = null;
  modalEliminarAbierta = false;
  clienteAEliminar: any = null;

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

  nuevoCliente = {
    nombre: '', apellido: '', telefono: '', correo: '', fk_membresia: null as number | null
  };

  membresias = [
    { id_membresia: 1, tipo: 'Semanal',   duracion_dias: 7,   precio: 150 },
    { id_membresia: 2, tipo: 'Quincenal', duracion_dias: 15,  precio: 250 },
    { id_membresia: 3, tipo: 'Mensual',   duracion_dias: 30,  precio: 400 },
    { id_membresia: 4, tipo: 'Anual',     duracion_dias: 365, precio: 3500 },
  ];

  statuses = ['activo', 'inactivo', 'suspendido'];
  clientes: any[] = [];

  constructor(private clientesService: ClientesService) {}

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando = true;
    this.clientesService.getClientes().subscribe({
      next: (data) => {
        this.clientes = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarToast('Error al cargar clientes', 'error');
        this.cargando = false;
      }
    });
  }

  get clientesFiltrados() {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.clientes;
    return this.clientes.filter(c =>
      c.nombre.toLowerCase().includes(q) ||
      c.apellido.toLowerCase().includes(q) ||
      c.telefono?.includes(q) ||
      c.membresia_tipo?.toLowerCase().includes(q)
    );
  }

  abrirModal() {
    this.nuevoCliente = { nombre: '', apellido: '', telefono: '', correo: '', fk_membresia: null };
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

  seleccionarMembresia(id: number) {
    this.nuevoCliente.fk_membresia = id;
  }

  guardar() {
    if (!this.nuevoCliente.fk_membresia) {
      this.mostrarToast('Por favor selecciona una membresía', 'error');
      return;
    }
    const nombre = `${this.nuevoCliente.nombre} ${this.nuevoCliente.apellido}`;
    this.clientesService.createCliente(this.nuevoCliente).subscribe({
      next: () => {
        this.cerrarModal();
        this.cargarClientes();
        this.mostrarToast(`${nombre} se ha registrado exitosamente`);
      },
      error: () => {
        this.mostrarToast('Error al registrar cliente', 'error');
      }
    });
  }

  abrirEditar(cliente: any) {
    this.clienteEditando = { ...cliente };
    this.modalEditarAbierta = true;
  }

  cerrarEditar() { this.modalEditarAbierta = false; this.clienteEditando = null; }

  guardarEdicion() {
  if (!this.clienteEditando) return;
  if (!this.clienteEditando.nombre || !this.clienteEditando.apellido) {
    this.mostrarToast('Nombre y apellido son obligatorios', 'error');
    return;
  }
  const nombre = `${this.clienteEditando.nombre} ${this.clienteEditando.apellido}`;
  this.clientesService.updateCliente(this.clienteEditando.id_cliente, this.clienteEditando).subscribe({
    next: () => {
      this.cerrarEditar();
      this.cargarClientes();
      this.mostrarToast(`${nombre} se ha actualizado exitosamente`);
    },
    error: () => {
      this.mostrarToast('Error al actualizar cliente', 'error');
    }
  });
}

  confirmarEliminar(cliente: any) {
    this.clienteAEliminar = cliente;
    this.modalEliminarAbierta = true;
  }

  cerrarEliminar() { this.modalEliminarAbierta = false; this.clienteAEliminar = null; }

  eliminar() {
  if (!this.clienteAEliminar) return;
  const nombre = `${this.clienteAEliminar.nombre} ${this.clienteAEliminar.apellido}`;
  this.clientesService.deleteCliente(this.clienteAEliminar.id_cliente).subscribe({
    next: () => {
      this.cerrarEliminar();
      this.cargarClientes();
      this.mostrarToast(`${nombre} se ha eliminado exitosamente`);
    },
    error: () => {
      this.mostrarToast('Error al eliminar cliente', 'error');
    }
  });
  }
}