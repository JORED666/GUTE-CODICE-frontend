import { Component, HostListener, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminService } from './core/services/admin';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'CODICE-FRONTEND';
  menuOpen = false;
  sidebarExpanded = false;
  mostrarLayout = false;

  adminFoto: string | null = null;
  adminNombre = 'Admin';

  private rutasSinLayout = ['/login'];

  constructor(private router: Router, private adminService: AdminService) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.mostrarLayout = !this.rutasSinLayout.includes(event.urlAfterRedirects);
      }
    });

    this.adminService.foto$.subscribe(foto => this.adminFoto = foto);
    this.adminService.nombre$.subscribe(nombre => this.adminNombre = nombre);
  }

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  cerrarSesion() {
    this.menuOpen = false;
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  closeMenu(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.topbar-right')) {
      this.menuOpen = false;
    }
  }
}