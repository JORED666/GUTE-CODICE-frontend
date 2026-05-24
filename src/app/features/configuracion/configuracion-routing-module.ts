import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Configuracion } from './configuracion/configuracion';

const routes: Routes = [
  { path: '', component: Configuracion }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfiguracionRoutingModule { }