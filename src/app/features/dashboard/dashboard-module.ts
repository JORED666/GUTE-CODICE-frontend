import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { Resumen } from './resumen/resumen';

@NgModule({
  imports: [CommonModule, DashboardRoutingModule, Resumen]
})
export class DashboardModule { }