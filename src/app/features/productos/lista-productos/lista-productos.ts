import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../core/services/productos';

@Component({
  selector: 'app-lista-productos',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css'
})
export class ListaProductos implements OnInit {

  busqueda = '';
  cargando = false;
  guardando = false;
  modalAbierta = false;
  modalEditarAbierta = false;
  modalEliminarAbierta = false;
  productoEditando: any = null;
  productoAEliminar: any = null;

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

  categorias = ['Suplemento', 'Accesorio', 'Ropa', 'Equipamiento', 'Otro'];

  nuevoProducto = {
    nombre: '', categoria: '', precio: null as number | null, stock: null as number | null
  };

  productos: any[] = [];

  constructor(private productosService: ProductosService, private zone: NgZone) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.cargando = true;
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.cargando = false;
        this.guardando = false;
      },
      error: () => {
        this.mostrarToast('Error al cargar productos', 'error');
        this.cargando = false;
        this.guardando = false;
      }
    });
  }

  get productosFiltrados() {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.productos;
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoria?.toLowerCase().includes(q)
    );
  }

  stockBadge(stock: number): string {
    if (stock === 0) return 'agotado';
    if (stock <= 5) return 'bajo';
    return 'disponible';
  }

  stockLabel(stock: number): string {
    if (stock === 0) return 'Agotado';
    if (stock <= 5) return 'Stock bajo';
    return 'Disponible';
  }

  abrirModal() {
    this.nuevoProducto = { nombre: '', categoria: '', precio: null, stock: null };
    this.modalAbierta = true;
  }

  cerrarModal() {
    this.modalAbierta = false;
    this.guardando = false;
  }

  guardar() {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.categoria ||
        this.nuevoProducto.precio === null || this.nuevoProducto.stock === null) {
      this.mostrarToast('Por favor llena todos los campos', 'error');
      return;
    }
    if (this.guardando) return;
    this.guardando = true;
    const nombre = this.nuevoProducto.nombre;
    this.productosService.createProducto(this.nuevoProducto).subscribe({
      next: (productoCreado) => {
        this.zone.run(() => {
          this.productos = [...this.productos, productoCreado];
          this.guardando = false;
          this.modalAbierta = false;
          this.mostrarToast(`${nombre} se ha registrado exitosamente`);
        });
      },
      error: () => {
        this.zone.run(() => {
          this.guardando = false;
          this.mostrarToast('Error al registrar producto', 'error');
        });
      }
    });
  }

  abrirEditar(producto: any) {
    this.productoEditando = { ...producto };
    this.modalEditarAbierta = true;
  }

  cerrarEditar() { this.modalEditarAbierta = false; this.productoEditando = null; }

  guardarEdicion() {
  if (!this.productoEditando) return;
  if (!this.productoEditando.nombre || !this.productoEditando.categoria) {
    this.mostrarToast('Nombre y categoría son obligatorios', 'error');
    return;
  }
  const nombre = this.productoEditando.nombre;
  const id = this.productoEditando.id_producto;
  this.productosService.updateProducto(id, this.productoEditando).subscribe({
    next: () => {
      this.zone.run(() => {
        this.cerrarEditar();
        this.cargarProductos();
        this.mostrarToast(`${nombre} se ha actualizado exitosamente`);
      });
    },
    error: () => {
      this.zone.run(() => {
        this.mostrarToast('Error al actualizar producto', 'error');
      });
    }
  });
}

  confirmarEliminar(producto: any) {
    this.productoAEliminar = producto;
    this.modalEliminarAbierta = true;
  }

  cerrarEliminar() { 
  this.modalEliminarAbierta = false; 
  this.productoAEliminar = null; 
  }

  eliminar() {
  if (!this.productoAEliminar) return;
  const nombre = this.productoAEliminar.nombre;
  const id = this.productoAEliminar.id_producto;
  this.productosService.deleteProducto(id).subscribe({
    next: () => {
      this.zone.run(() => {
        this.cerrarEliminar();
        this.cargarProductos();
        this.mostrarToast(`${nombre} se ha eliminado exitosamente`);
      });
    },
    error: () => {
      this.zone.run(() => {
        this.mostrarToast('Error al eliminar producto', 'error');
      });
    }
  });
  }
}