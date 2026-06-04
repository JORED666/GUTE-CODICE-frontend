import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MembresiasService } from '../../../core/services/membresias';

@Component({
  selector: 'app-lista-membresias',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './lista-membresias.html',
  styleUrl: './lista-membresias.css'
})
export class ListaMembresias implements OnInit {

  membresias: any[] = [];
  cargando = false;
  modalAbierta = false;
  membresiaEditando: any = null;

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

  iconos: Record<string, string> = {
    'Semanal': 'pi-calendar',
    'Quincenal': 'pi-calendar-plus',
    'Mensual': 'pi-calendar-times',
    'Anual': 'pi-star'
  };

  colores: Record<string, string> = {
    'Semanal': '#2196f3',
    'Quincenal': '#4caf50',
    'Mensual': '#ff9800',
    'Anual': '#9c27b0'
  };

  constructor(private membresiasService: MembresiasService) {}

  ngOnInit() {
    this.cargarMembresias();
  }

  cargarMembresias() {
    this.cargando = true;
    this.membresiasService.getMembresias().subscribe({
      next: (data) => {
        this.membresias = data;
        this.cargando = false;
      },
      error: () => {
        this.mostrarToast('Error al cargar membresías', 'error');
        this.cargando = false;
      }
    });
  }

  abrirEditar(membresia: any) {
    this.membresiaEditando = { ...membresia };
    this.modalAbierta = true;
  }

  cerrarModal() {
    this.modalAbierta = false;
    this.membresiaEditando = null;
  }

  guardar() {
    if (!this.membresiaEditando) return;
    if (!this.membresiaEditando.precio || !this.membresiaEditando.duracion_dias) {
    this.mostrarToast('Precio y duración son obligatorios', 'error');
    return;
  }
    this.membresiasService.updateMembresia(this.membresiaEditando.id_membresia, {
      precio: this.membresiaEditando.precio,
      duracion_dias: this.membresiaEditando.duracion_dias
    }).subscribe({
      next: (data) => {
        const idx = this.membresias.findIndex(m => m.id_membresia === data.id_membresia);
        if (idx !== -1) this.membresias[idx] = data;
        this.cerrarModal();
        this.mostrarToast(`Membresía ${data.tipo} actualizada exitosamente`);
      },
      error: () => {
        this.mostrarToast('Error al actualizar membresía', 'error');
      }
    });
  }
}