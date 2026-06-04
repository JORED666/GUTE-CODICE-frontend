import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ClientesService } from '../../../core/services/clientes';
import { MembresiasService } from '../../../core/services/membresias';

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
  menuAbierto: number | null = null;

  // Modal por vencer
  modalVencerAbierta = false;
  clientesPorVencer: any[] = [];
  cargandoVencer = false;

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

  membresias: any[] = [];
  statuses = ['activo', 'inactivo', 'suspendido'];
  clientes: any[] = [];

  constructor(
    private clientesService: ClientesService,
    private membresiasService: MembresiasService
  ) {}

  ngOnInit() {
    this.cargarClientes();
    this.cargarMembresias();
  }

  @HostListener('document:click', ['$event'])
  cerrarMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-tres-puntos')) {
      this.menuAbierto = null;
    }
  }

  toggleMenu(id: number, event: MouseEvent) {
    event.stopPropagation();
    this.menuAbierto = this.menuAbierto === id ? null : id;
  }

  cargarMembresias() {
    this.membresiasService.getMembresias().subscribe({
      next: (data) => this.membresias = data,
      error: () => {}
    });
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

  abrirModalVencer() {
    this.modalVencerAbierta = true;
    this.cargandoVencer = true;
    this.clientesService.getClientesPorVencer().subscribe({
      next: (data) => {
        this.clientesPorVencer = data;
        this.cargandoVencer = false;
      },
      error: () => {
        this.mostrarToast('Error al cargar clientes por vencer', 'error');
        this.cargandoVencer = false;
      }
    });
  }

  cerrarModalVencer() { this.modalVencerAbierta = false; }

  notificarWhatsapp(cliente: any) {
    const mensaje = encodeURIComponent(
      `Hola ${cliente.nombre}, te recordamos que tu membresía *${cliente.membresia_tipo}* vence el *${new Date(cliente.fecha_vencimiento).toLocaleDateString('es-MX')}*. ¡Renuévala para seguir disfrutando del gimnasio! 💪`
    );
    const telefono = cliente.telefono?.replace(/\D/g, '');
    if (!telefono) {
      this.mostrarToast('Este cliente no tiene teléfono registrado', 'error');
      return;
    }
    window.open(`https://wa.me/52${telefono}?text=${mensaje}`, '_blank');
    this.menuAbierto = null;
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
    this.menuAbierto = null;
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
    this.menuAbierto = null;
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

  paginaActual = 1;
porPagina = 10;

get totalPaginas(): number {
  return Math.ceil(this.clientesFiltrados.length / this.porPagina);
}

get clientesPaginados(): any[] {
  const inicio = (this.paginaActual - 1) * this.porPagina;
  return this.clientesFiltrados.slice(inicio, inicio + this.porPagina);
}

get paginas(): number[] {
  return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
}

cambiarPagina(pagina: number) {
  if (pagina < 1 || pagina > this.totalPaginas) return;
  this.paginaActual = pagina;
}
}