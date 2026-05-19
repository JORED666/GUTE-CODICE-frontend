import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajaRoutingModule } from './caja-routing-module';
import { HistorialPagos } from './historial-pagos/historial-pagos';
import { RegistroPago } from './registro-pago/registro-pago';

@NgModule({
  imports: [CommonModule, CajaRoutingModule, HistorialPagos, RegistroPago]
})
export class CajaModule { }