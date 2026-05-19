import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductosRoutingModule } from './productos-routing-module';
import { ListaProductos } from './lista-productos/lista-productos';
import { FormProducto } from './form-producto/form-producto';

@NgModule({
  imports: [CommonModule, ProductosRoutingModule, ListaProductos, FormProducto]
})
export class ProductosModule { }