import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Resumen } from './resumen/resumen';

const routes: Routes = [
  { path: '', component: Resumen }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }