import { Route } from "@angular/router";

import * as components from '../modules/shared';

export const ProducaoRoute: Route[] = [
  { path: '', component: components.HomeComponent },
  { 
    path: 'ordem',
    loadComponent: () => import('../modules/producao/ordem').then(m => m.Datatable),
    children: [
      { path: 'form', loadComponent: () => import('../modules/producao/ordem').then(m => m.Form) }
    ]
  },
];