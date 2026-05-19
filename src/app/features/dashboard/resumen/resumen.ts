import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-resumen',
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css'
})
export class Resumen {

  fechaHoy = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  totalClientes = 1248;
  gananciasMes = 42500;
  ventasProductos = 8300;
  reporteOpen = false;

  ultimosClientes = [
    { nombre: 'Juan Pérez',     membresia: 'Mensual',   vence: '15 Jun 2026', status: 'Activo' },
    { nombre: 'María García',   membresia: 'Quincenal', vence: '01 Jun 2026', status: 'Activo' },
    { nombre: 'Carlos López',   membresia: 'Semanal',   vence: '25 May 2026', status: 'Inactivo' },
    { nombre: 'Ana Martínez',   membresia: 'Anual',     vence: '01 Ene 2027', status: 'Activo' },
    { nombre: 'Luis Rodríguez', membresia: 'Mensual',   vence: '10 Jun 2026', status: 'Activo' },
  ];

  ultimosProductos = [
    { nombre: 'Proteína Whey',      categoria: 'Suplemento', fecha: '18 May 2026', monto: 850 },
    { nombre: 'Guantes de box',     categoria: 'Accesorio',  fecha: '17 May 2026', monto: 320 },
    { nombre: 'Creatina 500g',      categoria: 'Suplemento', fecha: '17 May 2026', monto: 450 },
    { nombre: 'Cuerda para saltar', categoria: 'Accesorio',  fecha: '16 May 2026', monto: 150 },
    { nombre: 'BCAA 300g',          categoria: 'Suplemento', fecha: '15 May 2026', monto: 380 },
  ];

  barData = [
    { mes: 'Ene', pct: 55 },
    { mes: 'Feb', pct: 70 },
    { mes: 'Mar', pct: 60 },
    { mes: 'Abr', pct: 85 },
    { mes: 'May', pct: 75 },
    { mes: 'Jun', pct: 90 },
  ];

  toggleReporte() {
    this.reporteOpen = !this.reporteOpen;
  }

  descargarReporte(tipo: 'mensual' | 'anual') {
    this.reporteOpen = false;
    // Aquí se conectará con el backend cuando esté listo
    console.log(`Descargando reporte ${tipo}...`);
    alert(`Reporte ${tipo} — se conectará al backend próximamente`);
  }

  @HostListener('document:click', ['$event'])
  cerrarDropdown(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.reporte-wrap')) {
      this.reporteOpen = false;
    }
  }
}