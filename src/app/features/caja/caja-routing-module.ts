import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroPago } from './registro-pago/registro-pago';
import { HistorialPagos } from './historial-pagos/historial-pagos';

const routes: Routes = [
  { path: '', component: HistorialPagos },
  { path: 'nuevo', component: RegistroPago }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CajaRoutingModule { }