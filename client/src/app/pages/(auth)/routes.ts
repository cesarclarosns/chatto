import { Route } from '@angular/router';

export const AUTH_ROUTES: Route[] = [
  {
    path: 'login',
    loadComponent: () =>
      import('./auth-login/auth-login.component').then(
        (mod) => mod.AuthLoginComponent
      ),
  },
];
