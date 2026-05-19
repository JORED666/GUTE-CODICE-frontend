import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesRoutingModule } from './clientes-routing-module';
import { ListaClientes } from './lista-clientes/lista-clientes';
import { FormCliente } from './form-cliente/form-cliente';

@NgModule({
  imports: [CommonModule, ClientesRoutingModule, ListaClientes, FormCliente]
})
export class ClientesModule { }