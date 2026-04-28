import { Route } from "@angular/router";

import * as components from '../modules/shared';

export const PessoaRoute: Route[] = [
  { path: '', component: components.HomeComponent },
  { 
    path: 'empresa',
    loadComponent: () => import('../modules/pessoa/empresa').then(m => m.Datatable),
    children: [
      { path: 'form', loadComponent: () => import('../modules/pessoa/empresa').then(m => m.Form) }
    ]
  },
  { 
    path: 'cliente',
    loadComponent: () => import('../modules/pessoa/cliente').then(m => m.Datatable),
    children: [
      { path: 'form', loadComponent: () => import('../modules/pessoa/cliente').then(m => m.Form) }
    ]
  },
];