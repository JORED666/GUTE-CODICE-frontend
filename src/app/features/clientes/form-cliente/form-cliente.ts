import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-cliente',
  imports: [CommonModule, RouterLink, MatIconModule, FormsModule],
  templateUrl: './form-cliente.html',
  styleUrl: './form-cliente.css'
})
export class FormCliente implements OnInit {

  esEdicion = false;
  titulo = 'Nuevo cliente';

  cliente = {
    nombre: '',
    apellido: '',
    telefono: '',
    correo: '',
    membresia: '',
    status: 'activo'
  };

  membresias = ['Semanal', 'Quincenal', 'Mensual', 'Anual'];
  statuses = ['activo', 'inactivo', 'suspendido'];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.titulo = 'Editar cliente';
      // Aquí se cargará el cliente desde el backend
      this.cliente = {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '961-100-0001',
        correo: 'juan@email.com',
        membresia: 'Mensual',
        status: 'activo'
      };
    }
  }

  guardar() {
    if (!this.cliente.nombre || !this.cliente.apellido || !this.cliente.membresia) {
      alert('Por favor llena los campos obligatorios');
      return;
    }
    // Aquí se conectará con el backend
    console.log('Guardando cliente:', this.cliente);
    this.router.navigate(['/clientes']);
  }
}