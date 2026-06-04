import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaMembresias } from './lista-membresias/lista-membresias';

const routes: Routes = [
  { path: '', component: ListaMembresias }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembresiasRoutingModule { }