import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial-pagos',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './historial-pagos.html',
  styleUrl: './historial-pagos.css'
})
export class HistorialPagos {

  busqueda = '';
  modalAbierta = false;
  modalEliminarAbierta = false;
  pagoAEliminar: any = null;

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

  conceptos = ['Membresía', 'Producto'];
  membresias = ['Semanal', 'Quincenal', 'Mensual', 'Anual'];

  productos = [
    { nombre: 'Proteína Whey 1kg',  precio: 850  },
    { nombre: 'Creatina 500g',      precio: 450  },
    { nombre: 'BCAA 300g',          precio: 380  },
    { nombre: 'Guantes de box',     precio: 320  },
    { nombre: 'Cuerda para saltar', precio: 150  },
    { nombre: 'Camiseta deportiva', precio: 200  },
    { nombre: 'Mancuernas 10kg par',precio: 1200 },
  ];

  nuevoPago = {
    cliente: '',
    concepto: '',
    detalle: '',
    monto: null as number | null
  };

  pagos = [
    { id: 1, cliente: 'Juan Pérez',     concepto: 'Membresía', detalle: 'Mensual',           monto: 400,  fecha: '19 May 2026' },
    { id: 2, cliente: 'María García',   concepto: 'Membresía', detalle: 'Quincenal',          monto: 250,  fecha: '19 May 2026' },
    { id: 3, cliente: 'Ana Martínez',   concepto: 'Producto',  detalle: 'Proteína Whey 1kg',  monto: 850,  fecha: '18 May 2026' },
    { id: 4, cliente: 'Luis Rodríguez', concepto: 'Membresía', detalle: 'Mensual',            monto: 400,  fecha: '18 May 2026' },
    { id: 5, cliente: 'Sofía Torres',   concepto: 'Producto',  detalle: 'Guantes de box',     monto: 320,  fecha: '17 May 2026' },
    { id: 6, cliente: 'Carlos López',   concepto: 'Membresía', detalle: 'Semanal',            monto: 150,  fecha: '17 May 2026' },
    { id: 7, cliente: 'Ana Martínez',   concepto: 'Producto',  detalle: 'Creatina 500g',      monto: 450,  fecha: '16 May 2026' },
  ];

  get pagosFiltrados() {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.pagos;
    return this.pagos.filter(p =>
      p.cliente.toLowerCase().includes(q) ||
      p.concepto.toLowerCase().includes(q) ||
      p.detalle.toLowerCase().includes(q)
    );
  }

  get totalHoy(): number {
    const hoy = '19 May 2026';
    return this.pagos
      .filter(p => p.fecha === hoy)
      .reduce((sum, p) => sum + p.monto, 0);
  }

  get pagosHoy(): number {
    return this.pagos.filter(p => p.fecha === '19 May 2026').length;
  }

  get totalMes(): number {
    return this.pagos.reduce((sum, p) => sum + p.monto, 0);
  }

  abrirModal() {
    this.nuevoPago = { cliente: '', concepto: '', detalle: '', monto: null };
    this.modalAbierta = true;
  }

  cerrarModal() { this.modalAbierta = false; }

  onConceptoChanged() {
    this.nuevoPago.detalle = '';
    this.nuevoPago.monto = null;
  }

  onProductoSeleccionado(nombre: string) {
    const prod = this.productos.find(p => p.nombre === nombre);
    if (prod) this.nuevoPago.monto = prod.precio;
  }

  onMembresiaSeleccionada(tipo: string) {
    const precios: Record<string, number> = {
      'Semanal': 150, 'Quincenal': 250, 'Mensual': 400, 'Anual': 3500
    };
    this.nuevoPago.monto = precios[tipo] ?? null;
  }

  guardar() {
    if (!this.nuevoPago.cliente || !this.nuevoPago.concepto ||
        !this.nuevoPago.detalle || this.nuevoPago.monto === null) {
      this.mostrarToast('Por favor llena todos los campos', 'error');
      return;
    }
    const cliente = this.nuevoPago.cliente;
    this.pagos.unshift({
      id: this.pagos.length + 1,
      cliente,
      concepto: this.nuevoPago.concepto,
      detalle: this.nuevoPago.detalle,
      monto: this.nuevoPago.monto!,
      fecha: '19 May 2026'
    });
    this.cerrarModal();
    this.mostrarToast(`Pago de ${cliente} registrado exitosamente`);
  }

  confirmarEliminar(pago: any) {
    this.pagoAEliminar = pago;
    this.modalEliminarAbierta = true;
  }

  cerrarEliminar() { this.modalEliminarAbierta = false; this.pagoAEliminar = null; }

  eliminar() {
    const cliente = this.pagoAEliminar.cliente;
    this.pagos = this.pagos.filter(p => p.id !== this.pagoAEliminar.id);
    this.cerrarEliminar();
    this.mostrarToast(`Pago de ${cliente} eliminado exitosamente`);
  }
}