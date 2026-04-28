import { Component, computed, signal, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Column as ColumnInterface } from '../../../../interfaces';

@Component({
  selector: 'datatable',
  imports: [
    MatToolbarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatProgressBarModule,
    NgStyle
],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable {

  @ViewChild(MatPaginator, { static: true })
  matPaginator!: MatPaginator;

  private _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  private _columns = signal<ColumnInterface[]>([]);
  readonly columns = this._columns.asReadonly();

  private _visibleColumns = signal<string[]>([]);
  readonly visibleColumns = this._visibleColumns.asReadonly();

  private _data = signal<any[]>([]);
  readonly data = this._data.asReadonly();

  private _pageSize = signal(50);
  readonly pageSize = this._pageSize.asReadonly();

  private _pageSizeOptions = signal([ 50, 100, 500, 1000 ]);
  readonly pageSizeOptions = this._pageSizeOptions.asReadonly();

  constructor() {
   
  }

  ngOnInit(): void {
    
  }

  setColumns(columns: ColumnInterface[]) {
    this._columns.set(columns);
    this._visibleColumns.set(columns
      .filter(f => f.visible)
      .map(m => m.column_def));
  }

  setData(data: any[]): void {
    this._data.set(data);
  }
}
