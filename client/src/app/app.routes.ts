import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/(auth)/routes').then((mod) => mod.AUTH_ROUTES),
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./pages/(app)/routes').then((mod) => mod.APP_ROUTES),
  },
  {
    path: '',
    loadChildren: () =>
      import('./pages/(marketing)/routes').then((mod) => mod.MARKETING_ROUTES),
  },
];
