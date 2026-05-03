import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxMaskPipe } from 'ngx-mask';

import { Column as ColumnInterface, Action as ActionInterface } from '../../interfaces';
import { DataSource } from './helpers';

@Component({
  selector: 'datatable',
  imports: [
    MatToolbarModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatProgressBarModule, MatButtonModule, MatIconModule, NgStyle,
    NgxMaskPipe
  ],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable {

  @ViewChild(MatPaginator) matPaginator!: MatPaginator;

  public dataSource = inject(DataSource);

  private _columns = signal<ColumnInterface[]>([]);
  private _actions = signal<ActionInterface[]>([]);

  readonly columns = this._columns.asReadonly();
  readonly visibleColumns = computed(() =>
    this._columns().filter(c => c.visible).map(c => c.column_def)
  );
  readonly actions = this._actions.asReadonly();

  readonly pageData = this.dataSource.pageData;
  readonly total = this.dataSource.total;
  readonly pageSize = this.dataSource.pageSize;
  readonly isLoading = this.dataSource.loading;

  setConfig(
    columns: ColumnInterface[],
    actions: ActionInterface[] = [],
    data: any[] = [],
    endpoint?: string
  ) {
    this._columns.set(columns);
    this._actions.set(actions);
    this.dataSource.setData(data, endpoint);
  }
}