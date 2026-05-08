import { Component, inject, Input, ViewChild } from '@angular/core';

import { Datatable as Dt } from '../../../../shared/components';

import { COLUMNS } from './columns';
import { ACTIONS } from './actions';
import { Action } from '../../../../shared';

import { AppService } from '../../../../../services';

@Component({
  selector: 'pessoa-empresa-datatable',
  imports: [ Dt ],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable {

  @ViewChild(Dt, { static: true })
  datatable!: Dt;

  @Input() 
  data: any[] = [];

  private appService = inject(AppService);

  constructor() {

  }

  ngOnInit(): void {
    this.datatable.setConfig(COLUMNS, ACTIONS, this.data, 'pessoa/empresa');
    this.datatable.onAction.subscribe((action) => {
      const method = (this as any)[action.name];
      if(typeof method === 'function')
        method.call(this, action);
    });
  }

  add(action: Action): void {
    this.appService.nav('pessoa/empresa/form');
  }

  edit(action: Action): void {
    this.appService.nav('pessoa/empresa/form');
  }
}
