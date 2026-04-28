import { Routes } from '@angular/router';

import * as components from '../components';

export const routes: Routes = [
  {
    path: '', 
    component: components.App,
    children: [
      { path: 'profile', component: components.Profile },
      { path: 'pessoa', loadChildren: () => import('./pessoa.route').then(m => m.PessoaRoute) },
      { path: 'comercial', loadChildren: () => import('./comercial.route').then(m => m.ComercialRoute) },
      { path: 'producao', loadChildren: () => import('./producao.route').then(m => m.ProducaoRoute) },
    ]
  },
  { path: 'login', component: components.Login },
];
 