import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../../../core/services/pagos';
import { ProductosService } from '../../../core/services/productos';

@Component({
  selector: 'app-historial-pagos',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './historial-pagos.html',
  styleUrl: './historial-pagos.css'
})
export class HistorialPagos implements OnInit {

  busqueda = '';
  cargando = false;
  guardando = false;
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
  productos: any[] = [];

  nuevoPago = {
    cliente: '',
    concepto: '',
    detalle: '',
    monto: null as number | null
  };

  pagos: any[] = [];

  constructor(
    private pagosService: PagosService,
    private productosService: ProductosService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.cargarPagos();
    this.cargarProductos();
  }

  cargarPagos() {
    this.cargando = true;
    this.pagosService.getPagos().subscribe({
      next: (data) => {
        this.pagos = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarToast('Error al cargar pagos', 'error');
        this.cargando = false;
      }
    });
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (data) => this.productos = data,
      error: () => {}
    });
  }

  get pagosFiltrados() {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.pagos;
    return this.pagos.filter(p =>
      p.cliente_nombre?.toLowerCase().includes(q) ||
      p.concepto?.toLowerCase().includes(q) ||
      p.detalle?.toLowerCase().includes(q)
    );
  }

  get totalHoy(): number {
    const hoy = new Date().toISOString().split('T')[0];
    return this.pagos
      .filter(p => p.fecha?.startsWith(hoy))
      .reduce((sum, p) => sum + Number(p.monto), 0);
  }

  get pagosHoy(): number {
    const hoy = new Date().toISOString().split('T')[0];
    return this.pagos.filter(p => p.fecha?.startsWith(hoy)).length;
  }

  get totalMes(): number {
    return this.pagos.reduce((sum, p) => sum + Number(p.monto), 0);
  }

  abrirModal() {
    this.nuevoPago = { cliente: '', concepto: '', detalle: '', monto: null };
    this.modalAbierta = true;
  }

  cerrarModal() {
    this.modalAbierta = false;
    this.guardando = false;
  }

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
  if (!this.nuevoPago.detalle || this.nuevoPago.monto === null) {
    this.mostrarToast('Por favor selecciona un producto', 'error');
    return;
  }
  if (this.guardando) return;
  this.guardando = true;
  this.pagosService.createPago({
    concepto: 'Producto',
    detalle: this.nuevoPago.detalle,
    monto: this.nuevoPago.monto
  }).subscribe({
    next: () => {
      this.zone.run(() => {
        this.guardando = false;
        this.modalAbierta = false;
        this.cargarPagos();
        this.mostrarToast(`Venta de ${this.nuevoPago.detalle} registrada exitosamente`);
      });
    },
    error: () => {
      this.zone.run(() => {
        this.guardando = false;
        this.mostrarToast('Error al registrar venta', 'error');
      });
    }
  });
}

  confirmarEliminar(pago: any) {
    this.pagoAEliminar = pago;
    this.modalEliminarAbierta = true;
  }

  cerrarEliminar() {
    this.modalEliminarAbierta = false;
    this.pagoAEliminar = null;
  }

  eliminar() {
    if (!this.pagoAEliminar) return;
    const cliente = this.pagoAEliminar.cliente_nombre;
    const id = this.pagoAEliminar.id_pago;
    this.pagosService.deletePago(id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.cerrarEliminar();
          this.cargarPagos();
          this.mostrarToast(`Pago de ${cliente} eliminado exitosamente`);
        });
      },
      error: () => {
        this.zone.run(() => {
          this.mostrarToast('Error al eliminar pago', 'error');
        });
      }
    });
  }
}