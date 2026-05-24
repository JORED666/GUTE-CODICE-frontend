import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () => import('./features/auth/auth-module')
      .then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadChildren: () => import('./features/dashboard/dashboard-module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'clientes',
    canActivate: [authGuard],
    loadChildren: () => import('./features/clientes/clientes-module')
      .then(m => m.ClientesModule)
  },
  {
    path: 'productos',
    canActivate: [authGuard],
    loadChildren: () => import('./features/productos/productos-module')
      .then(m => m.ProductosModule)
  },
  {
    path: 'caja',
    canActivate: [authGuard],
    loadChildren: () => import('./features/caja/caja-module')
      .then(m => m.CajaModule)
  },
  {
    path: 'configuracion',
    canActivate: [authGuard],
    loadChildren: () => import('./features/configuracion/configuracion-module')
      .then(m => m.ConfiguracionModule)
  },
  { path: '**', redirectTo: 'login' }
];