import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'juegos',
        pathMatch: 'full',
      },
      {
        path: 'juegos',
        loadComponent: () => import('./features/games/pages/games-page/games-page'),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./features/clients/pages/client-page/client-page'),
      },
      {
        path: 'prestamos',
        loadComponent: () => import('./features/loans/pages/loans-page/loans-page'),
      },
      {
        path: 'categorías',
        loadComponent: () => import('./features/categories/pages/category-page/category-page'),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'juegos',
  },
];
