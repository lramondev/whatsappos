import { Component, inject, Input, ViewChild } from '@angular/core';

import { Datatable as Dt } from '../../../../shared/components';

import { COLUMNS } from './columns';
import { ACTIONS } from './actions';
import { Action } from '../../../../shared';

import { AppService } from '../../../../../services';
import { MatDialog } from '@angular/material/dialog';
import { Form } from '../form/form';

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
  private matDialog = inject(MatDialog);

  constructor() {}

  ngOnInit(): void {
    this.datatable.setConfig(COLUMNS, ACTIONS, this.data, 'pessoa/empresa');
    this.datatable.onAction.subscribe((action) => {
      const method = (this as any)[action.name];
      if(typeof method === 'function')
        method.call(this, action);
    });
  }

  add(action: Action): void {
    /*const dialogRef = this.matDialog.open(Form, {
      height: '580px',
      width: '980px',
      disableClose: true
    });

    dialogRef.componentInstance.onCancel.subscribe(() => dialogRef.close());
    */
    this.appService.nav('pessoa/empresa/form');
  }

  edit(action: Action): void {
    this.appService.nav('pessoa/empresa/form');
  }
}
