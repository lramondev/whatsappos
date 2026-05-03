import { Component, ViewChild } from '@angular/core';

import { Datatable as Dt } from '../../../../shared/components';

import { COLUMNS } from './columns';
import { ACTIONS } from './actions';

@Component({
  selector: 'pessoa-empresa-datatable',
  imports: [ Dt ],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable {

  @ViewChild(Dt, { static: true })
  datatable!: Dt;

  data: any[] = [
    { id: 1, nome_razao_social: 'Hydrogen', apelido_fantasia: 'Hydrogen', cpf_cnpj: '82714783000130' },
    { id: 2, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '01498146155' },
    { id: 3, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 4, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 5, nome_razao_social: 'Boron', apelido_fantasia: 'Boron', cpf_cnpj: '' },
    { id: 6, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 7, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 8, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 9, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 10, nome_razao_social: 'Hydrogen', apelido_fantasia: 'Hydrogen', cpf_cnpj: '82714783000130' },
    { id: 11, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '' },
    { id: 12, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 13, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 14, nome_razao_social: 'Boron', apelido_fantasia: 'Boron', cpf_cnpj: '' },
    { id: 15, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 16, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 17, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 18, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 19, nome_razao_social: 'Hydrogen', apelido_fantasia: 'Hydrogen', cpf_cnpj: '82714783000130' },
    { id: 20, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '' },
    { id: 21, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 22, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 23, nome_razao_social: 'Boron', apelido_fantasia: 'Boron', cpf_cnpj: '' },
    { id: 24, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 25, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 26, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 27, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 28, nome_razao_social: 'Hydrogen', apelido_fantasia: 'Hydrogen', cpf_cnpj: '82714783000130' },
    { id: 29, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '' },
    { id: 30, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 31, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 32, nome_razao_social: 'Boron', apelido_fantasia: 'Boron', cpf_cnpj: '' },
    { id: 33, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 34, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 35, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 36, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 37, nome_razao_social: 'Hydrogen', apelido_fantasia: 'Hydrogen', cpf_cnpj: '82714783000130' },
    { id: 38, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '' },
    { id: 39, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 40, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 41, nome_razao_social: 'Boron', apelido_fantasia: 'Boron', cpf_cnpj: '' },
    { id: 42, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 43, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 44, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 45, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 46, nome_razao_social: 'Hydrogen', apelido_fantasia: 'Hydrogen', cpf_cnpj: '82714783000130' },
    { id: 47, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '' },
    { id: 48, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 49, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 50, nome_razao_social: 'Boron', apelido_fantasia: 'Boron', cpf_cnpj: '' },
    { id: 51, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 52, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 53, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 54, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 55, nome_razao_social: 'Hydrogen', apelido_fantasia: 'Hydrogen', cpf_cnpj: '82714783000130' },
    { id: 56, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '' },
    { id: 57, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 58, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 59, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 60, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 61, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 61, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
  ];

  constructor() {

  }

  ngOnInit(): void {
    this.datatable.setConfig(COLUMNS, ACTIONS, this.data);
  }
}
