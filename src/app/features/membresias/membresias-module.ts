import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembresiasRoutingModule } from './membresias-routing-module';
import { ListaMembresias } from './lista-membresias/lista-membresias';

@NgModule({
  imports: [CommonModule, MembresiasRoutingModule, ListaMembresias]
})
export class MembresiasModule { } 