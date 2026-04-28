import { App } from '../interfaces/app.interface';

export const AppData: App = {
  name: 'whatsappOS',
  version: '1.0.0',
  modules: [
    { 
      id: 1, name: 'Pessoa', description: '', version: '1.0.0', route: 'pessoa', icon: 'supervisor_account', 
      resources: [
        { id: 101, name: 'Empresa', description: '', version: '1.0.0', route: 'empresa', icon: 'corporate_fare' },
        { id: 102, name: 'Cliente', description: '', version: '1.0.0', route: 'cliente', icon: 'business_center' }
      ] 
    },
    { 
      id: 2, name: 'Comercial', description: '', version: '1.0.0', route: 'comercial', icon: 'trolley', 
      resources: [
        { id: 201, name: 'Produto', description: '', version: '1.0.0', route: 'produto', icon: 'barcode_scanner' },
        { id: 201, name: 'Estoque', description: '', version: '1.0.0', route: 'estoque', icon: 'corporate_fare' },
      ] 
    },
    {
      id: 4, name: 'Produção', description: '', version: '1.0.0', route: 'producao', icon: 'precision_manufacturing', 
      resources: [
        { id: 401, name: 'Ordem', description: '', version: '1.0.0', route: 'ordem', icon: 'rule_settings' },
      ]
    }
  ],
  settings: {
    theme: 'chartreuse-theme',
    dark: true,
    left_sidenav: true,
    left_sidenav_opened: true,
    right_sidenav: true,
    right_sidenav_opened: false,
  }
}