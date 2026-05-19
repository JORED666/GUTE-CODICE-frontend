import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaClientes } from './lista-clientes/lista-clientes';
import { FormCliente } from './form-cliente/form-cliente';

const routes: Routes = [
  { path: '', component: ListaClientes },
  { path: 'nuevo', component: FormCliente },
  { path: 'editar/:id', component: FormCliente }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientesRoutingModule { }