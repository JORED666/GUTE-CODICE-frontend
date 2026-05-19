import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-productos',
  imports: [CommonModule, MatIconModule, FormsModule],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css'
})
export class ListaProductos {

  busqueda = '';
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

  productos = [
    { id: 1, nombre: 'Proteína Whey 1kg',    categoria: 'Suplemento',  precio: 850,  stock: 24 },
    { id: 2, nombre: 'Creatina 500g',         categoria: 'Suplemento',  precio: 450,  stock: 15 },
    { id: 3, nombre: 'BCAA 300g',             categoria: 'Suplemento',  precio: 380,  stock: 8  },
    { id: 4, nombre: 'Guantes de box',        categoria: 'Accesorio',   precio: 320,  stock: 30 },
    { id: 5, nombre: 'Cuerda para saltar',    categoria: 'Accesorio',   precio: 150,  stock: 3  },
    { id: 6, nombre: 'Camiseta deportiva',    categoria: 'Ropa',        precio: 200,  stock: 20 },
    { id: 7, nombre: 'Mancuernas 10kg par',   categoria: 'Equipamiento',precio: 1200, stock: 0  },
  ];

  get productosFiltrados() {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.productos;
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
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

  cerrarModal() { this.modalAbierta = false; }

  guardar() {
    if (!this.nuevoProducto.nombre || !this.nuevoProducto.categoria ||
        this.nuevoProducto.precio === null || this.nuevoProducto.stock === null) {
      this.mostrarToast('Por favor llena todos los campos', 'error');
      return;
    }
    const nombre = this.nuevoProducto.nombre;
    this.productos.push({
      id: this.productos.length + 1,
      nombre,
      categoria: this.nuevoProducto.categoria,
      precio: this.nuevoProducto.precio!,
      stock: this.nuevoProducto.stock!
    });
    this.cerrarModal();
    this.mostrarToast(`${nombre} se ha registrado exitosamente`);
  }

  abrirEditar(producto: any) {
    this.productoEditando = { ...producto };
    this.modalEditarAbierta = true;
  }

  cerrarEditar() { this.modalEditarAbierta = false; this.productoEditando = null; }

  guardarEdicion() {
    if (!this.productoEditando.nombre || !this.productoEditando.categoria) {
      this.mostrarToast('Nombre y categoría son obligatorios', 'error');
      return;
    }
    const nombre = this.productoEditando.nombre;
    const idx = this.productos.findIndex(p => p.id === this.productoEditando.id);
    if (idx !== -1) this.productos[idx] = { ...this.productoEditando };
    this.cerrarEditar();
    this.mostrarToast(`${nombre} se ha actualizado exitosamente`);
  }

  confirmarEliminar(producto: any) {
    this.productoAEliminar = producto;
    this.modalEliminarAbierta = true;
  }

  cerrarEliminar() { this.modalEliminarAbierta = false; this.productoAEliminar = null; }

  eliminar() {
    const nombre = this.productoAEliminar.nombre;
    this.productos = this.productos.filter(p => p.id !== this.productoAEliminar.id);
    this.cerrarEliminar();
    this.mostrarToast(`${nombre} se ha eliminado exitosamente`);
  }
}