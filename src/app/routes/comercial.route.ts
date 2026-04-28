import { Route } from "@angular/router";

import * as components from '../modules/shared';

export const ComercialRoute: Route[] = [
  { path: '', component: components.HomeComponent },
  { 
    path: 'produto',
    loadComponent: () => import('../modules/comercial/produto').then(m => m.Datatable),
    children: [
      { 
        path: 'form', 
        loadComponent: () => import('../modules/comercial/produto').then(m => m.Form) 
      }
    ]
  },
  { 
    path: 'estoque',
    loadComponent: () => import('../modules/comercial/estoque').then(m => m.Datatable),
    children: [
      { 
        path: 'form', 
        loadComponent: () => import('../modules/comercial/estoque').then(m => m.Form) 
      }
    ]
  },
];