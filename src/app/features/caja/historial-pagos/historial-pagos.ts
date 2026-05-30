import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PagosService } from '../../../core/services/pagos';
import { ProductosService } from '../../../core/services/productos';
import { MembresiasService } from '../../../core/services/membresias';

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
  precioVisita = 50;
  paginaActual = 1;
  porPagina = 10;

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

  productos: any[] = [];
  pagos: any[] = [];

  nuevoPago = {
    detalle: '',
    monto: null as number | null
  };

  constructor(
    private pagosService: PagosService,
    private productosService: ProductosService,
    private membresiasService: MembresiasService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.cargarPagos();
    this.cargarProductos();
    this.cargarPrecioVisita();
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

  cargarPrecioVisita() {
    this.membresiasService.getMembresias().subscribe({
      next: (data) => {
        const visita = data.find((m: any) => m.tipo === 'Visita');
        if (visita) this.precioVisita = parseFloat(visita.precio);
      },
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

  get totalPaginas(): number {
    return Math.ceil(this.pagosFiltrados.length / this.porPagina);
  }

  get pagosPaginados(): any[] {
    const inicio = (this.paginaActual - 1) * this.porPagina;
    return this.pagosFiltrados.slice(inicio, inicio + this.porPagina);
  }

  get paginas(): number[] {
    return Array.from({ length: this.totalPaginas }, (_, i) => i + 1);
  }

  cambiarPagina(pagina: number) {
    if (pagina < 1 || pagina > this.totalPaginas) return;
    this.paginaActual = pagina;
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

  registrarVisita() {
    this.pagosService.createPago({
      concepto: 'Membresía',
      detalle: 'Visita',
      monto: this.precioVisita
    }).subscribe({
      next: () => {
        this.zone.run(() => {
          this.cargarPagos();
          this.mostrarToast(`Visita registrada — $${this.precioVisita}`);
        });
      },
      error: () => {
        this.zone.run(() => {
          this.mostrarToast('Error al registrar visita', 'error');
        });
      }
    });
  }

  abrirModal() {
    this.nuevoPago = { detalle: '', monto: null };
    this.modalAbierta = true;
  }

  cerrarModal() {
    this.modalAbierta = false;
    this.guardando = false;
  }

  onProductoSeleccionado(nombre: string) {
    const prod = this.productos.find(p => p.nombre === nombre);
    if (prod) this.nuevoPago.monto = prod.precio;
  }

  guardar() {
    if (!this.nuevoPago.detalle || this.nuevoPago.monto === null) {
      this.mostrarToast('Por favor selecciona un producto', 'error');
      return;
    }
    if (this.guardando) return;
    this.guardando = true;
    const detalle = this.nuevoPago.detalle;
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
          this.mostrarToast(`Venta de ${detalle} registrada exitosamente`);
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
    const id = this.pagoAEliminar.id_pago;
    this.pagosService.deletePago(id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.cerrarEliminar();
          this.cargarPagos();
          this.mostrarToast(`Pago eliminado exitosamente`);
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