import { Route } from '@angular/router';

export const MARKETING_ROUTES: Route[] = [
  {
    path: 'pricing',
    loadComponent: () =>
      import('./marketing-pricing/marketing-pricing.component').then(
        (mod) => mod.MarketingPricingComponent
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./marketing-home/marketing-home.component').then(
        (mod) => mod.MarketingHomeComponent
      ),
  },
];
