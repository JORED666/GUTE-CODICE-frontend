import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard-module')
      .then(m => m.DashboardModule)
  },
  {
    path: 'clientes',
    loadChildren: () => import('./features/clientes/clientes-module')
      .then(m => m.ClientesModule)
  },
  {
    path: 'productos',
    loadChildren: () => import('./features/productos/productos-module')
      .then(m => m.ProductosModule)
  },
  {
    path: 'caja',
    loadChildren: () => import('./features/caja/caja-module')
      .then(m => m.CajaModule)
  },
  { path: '**', redirectTo: 'dashboard' }
];