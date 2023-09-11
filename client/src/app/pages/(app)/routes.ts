import { Route } from '@angular/router';

export const APP_ROUTES: Route[] = [
  {
    path: '**',
    loadComponent: () =>
      import('./app-home/app-home.component').then(
        (mod) => mod.AppHomeComponent
      ),
  },
];
