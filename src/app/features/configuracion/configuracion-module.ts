import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracionRoutingModule } from './configuracion-routing-module';
import { Configuracion } from './configuracion/configuracion';

@NgModule({
  imports: [CommonModule, ConfiguracionRoutingModule, Configuracion]
})
export class ConfiguracionModule { }