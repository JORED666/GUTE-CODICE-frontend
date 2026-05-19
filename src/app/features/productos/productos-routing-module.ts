import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProductos } from './lista-productos/lista-productos';
import { FormProducto } from './form-producto/form-producto';

const routes: Routes = [
  { path: '', component: ListaProductos },
  { path: 'nuevo', component: FormProducto },
  { path: 'editar/:id', component: FormProducto }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }