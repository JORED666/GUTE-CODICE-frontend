import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
  Chart,
  CategoryScale, LinearScale, BarElement, BarController,
  ArcElement, DoughnutController,
  LineElement, LineController, PointElement,
  Tooltip, Legend, Filler
} from 'chart.js';

Chart.register(
  CategoryScale, LinearScale, BarElement, BarController,
  ArcElement, DoughnutController,
  LineElement, LineController, PointElement,
  Tooltip, Legend, Filler
);

@Component({
  selector: 'app-resumen',
  imports: [CommonModule, RouterLink, MatIconModule, BaseChartDirective],
  templateUrl: './resumen.html',
  styleUrl: './resumen.css'
})
export class Resumen implements OnInit {

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

  barChartData: ChartData<'bar'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Ingresos ($)',
        data: [28000, 35000, 30000, 42000, 38000, 42500],
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
        borderColor: '#2e7d32',
        borderWidth: 2,
        borderRadius: 6,
        hoverBackgroundColor: 'rgba(46, 125, 50, 0.9)',
      }
    ]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y ?? 0} clientes`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f0f0f0' },
        ticks: {
          callback: (val) => `$${Number(val).toLocaleString()}`
        }
      }
    }
  };

  doughnutData: ChartData<'doughnut'> = {
    labels: ['Mensual', 'Quincenal', 'Semanal', 'Anual'],
    datasets: [{
      data: [66, 20, 9, 5],
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
      hoverBackgroundColor: ['#2e7d32', '#1565c0', '#e65100', '#c62828'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 16,
          font: { size: 13 },
          usePointStyle: true,
          pointStyleWidth: 10
        }
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}%`
        }
      }
    },
    cutout: '70%'
  };

  lineChartData: ChartData<'line'> = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [{
      label: 'Clientes nuevos',
      data: [45, 72, 58, 91, 84, 110],
      borderColor: '#2196f3',
      backgroundColor: 'rgba(33, 150, 243, 0.1)',
      pointBackgroundColor: '#2196f3',
      pointRadius: 5,
      pointHoverRadius: 7,
      borderWidth: 2,
      fill: true,
      tension: 0.4
    }]
  };

  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y} clientes`
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: '#f0f0f0' },
        beginAtZero: true
      }
    }
  };

  ngOnInit() {}

  toggleReporte() { this.reporteOpen = !this.reporteOpen; }

  descargarReporte(tipo: 'mensual' | 'anual') {
    this.reporteOpen = false;
    alert(`Reporte ${tipo} — se conectará al backend próximamente`);
  }
}