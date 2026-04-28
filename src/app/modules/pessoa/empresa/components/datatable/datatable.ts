import { Component, ViewChild } from '@angular/core';

import { Datatable as Dt } from '../../../../shared/components';

import { COLUMNS } from './columns';

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
    { id: 2, nome_razao_social: 'Helium', apelido_fantasia: 'Helium', cpf_cnpj: '' },
    { id: 3, nome_razao_social: 'Lithium', apelido_fantasia: 'Lithium', cpf_cnpj: '' },
    { id: 4, nome_razao_social: 'Beryllium', apelido_fantasia: 'Beryllium', cpf_cnpj: '' },
    { id: 5, nome_razao_social: 'Boron', apelido_fantasia: 'Boron', cpf_cnpj: '' },
    { id: 6, nome_razao_social: 'Carbon', apelido_fantasia: 'Carbon', cpf_cnpj: '' },
    { id: 7, nome_razao_social: 'Nitrogen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 8, nome_razao_social: 'Oxygen', apelido_fantasia: '', cpf_cnpj: '' },
    { id: 9, nome_razao_social: 'Fluorine', apelido_fantasia: '', cpf_cnpj: '' },
  ];

  constructor() {

  }

  ngOnInit(): void {
    this.datatable.setColumns(COLUMNS);
    this.datatable.setData(this.data);
  }
}
