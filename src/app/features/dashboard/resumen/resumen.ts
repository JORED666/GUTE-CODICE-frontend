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
import { DashboardService } from '../../../core/services/dashboard';

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

  totalClientes = 0;
  gananciasMes = 0;
  ventasProductos = 0;
  reporteOpen = false;
  cargando = false;

  ultimosClientes: any[] = [];
  ultimosProductos: any[] = [];

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [{
      label: 'Ingresos ($)',
      data: [],
      backgroundColor: 'rgba(76, 175, 80, 0.8)',
      borderColor: '#2e7d32',
      borderWidth: 2,
      borderRadius: 6,
      hoverBackgroundColor: 'rgba(46, 125, 50, 0.9)',
    }]
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` $${ctx.parsed.y?.toLocaleString()}`
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
    labels: [],
    datasets: [{
      data: [],
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
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}`
        }
      }
    },
    cutout: '70%'
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.cargarDashboard();
  }

  cargarDashboard() {
    this.cargando = true;
    this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.totalClientes = data.totalClientes;
        this.gananciasMes = data.gananciasMes;
        this.ventasProductos = data.ventasProductos;
        this.ultimosClientes = data.ultimosClientes;
        this.ultimosProductos = data.ultimosProductos;

        this.barChartData = {
          labels: data.ingresosPorMes.map((i: any) => i.mes),
          datasets: [{
            label: 'Ingresos ($)',
            data: data.ingresosPorMes.map((i: any) => parseFloat(i.total)),
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
            borderColor: '#2e7d32',
            borderWidth: 2,
            borderRadius: 6,
            hoverBackgroundColor: 'rgba(46, 125, 50, 0.9)',
          }]
        };

        this.doughnutData = {
          labels: data.distribucionMembresias.map((m: any) => m.tipo),
          datasets: [{
            data: data.distribucionMembresias.map((m: any) => parseInt(m.total)),
            backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#f44336'],
            hoverBackgroundColor: ['#2e7d32', '#1565c0', '#e65100', '#c62828'],
            borderWidth: 0,
            hoverOffset: 6
          }]
        };

        this.cargando = false;
      },
      error: () => {
        this.cargando = false;
      }
    });
  }

  toggleReporte() { this.reporteOpen = !this.reporteOpen; }

  descargarReporte(tipo: 'mensual' | 'anual') {
    this.reporteOpen = false;
    alert(`Reporte ${tipo} — se conectará al backend próximamente`);
  }
}