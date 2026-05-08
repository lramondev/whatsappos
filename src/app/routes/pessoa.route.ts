import { Route } from "@angular/router";

import * as components from '../modules/shared';

export const PessoaRoute: Route[] = [
  { path: '', component: components.HomeComponent },
  { path: 'empresa', loadComponent: () => import('../modules/pessoa/empresa').then(m => m.Datatable) },
  { path: 'empresa/form', loadComponent: () => import('../modules/pessoa/empresa').then(m => m.Form) },
  
  { path: 'cliente', loadComponent: () => import('../modules/pessoa/cliente').then(m => m.Datatable) },
  { path: 'cliente/form', loadComponent: () => import('../modules/pessoa/cliente').then(m => m.Form) }
];