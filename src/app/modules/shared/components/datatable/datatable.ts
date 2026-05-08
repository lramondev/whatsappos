import { Component, computed, ElementRef, EventEmitter, HostListener, inject, Output, signal, ViewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';

import { firstValueFrom } from 'rxjs';
import { NgxMaskPipe } from 'ngx-mask';

import { ApiService } from '../../../../services';
import { Column, Action } from '../../interfaces';

export interface PaginatedResponse {
  data: any[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

@Component({
  selector: 'datatable',
  imports: [
    MatToolbarModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatBadgeModule,
    MatTabsModule, MatMenuModule, MatDividerModule, MatIconModule, NgStyle, NgxMaskPipe
  ],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable {

  @ViewChild('contextMenu', { static: true }) contextMenu!: MatMenuTrigger;
  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef<HTMLDivElement>;

  @Output() onAction = new EventEmitter<Action>();

  private _apiService = inject(ApiService);

  // Signals
  private _columns = signal<Column[]>([]);
  private _actions = signal<Action[]>([]);
  private _fullData = signal<any[]>([]);
  private _pageData = signal<any[]>([]);
  private _selectedData = signal<any[]>([]);
  private _total = signal(0);
  private _page = signal(1);
  private _pageSize = signal(20);
  private _pageSizeOptions = signal([20, 100, 500, 1000]);
  private _endpoint = signal('');
  private _loading = signal(false);

  readonly columns = this._columns.asReadonly();
  readonly actions = this._actions.asReadonly();
  readonly pageData = this._pageData.asReadonly();
  readonly selectedData = this._selectedData.asReadonly();
  readonly total = this._total.asReadonly();
  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly pageSizeOptions = this._pageSizeOptions.asReadonly();
  readonly endpoint = this._endpoint.asReadonly();
  readonly loading = this._loading.asReadonly();

  readonly visibleColumns = computed(() =>
    this._columns().filter(c => c.visible).map(c => c.column_def)
  );

  contextMenuPosition = { x: '0px', y: '0px' };

  // ==================== CONFIG ====================
  setConfig(columns: Column[], actions: Action[] = [], data: any[] = [], endpoint?: string) {
    this._columns.set(columns);
    this._actions.set(actions);
    this.setData(data, endpoint);
  }

  setData(data: any[] = [], endpoint?: string, pageSize = 20) {
    this._pageSize.set(pageSize);
    this._page.set(1);

    if (data?.length) {
      this._endpoint.set('');
      this._fullData.set([...data]);
      this._total.set(data.length);
      this.updatePageData(1);
    } else if (endpoint) {
      this._endpoint.set(endpoint);
      this.loadRemotePage(1, pageSize);
    }
  }

  // ==================== CONTEXT MENU ====================
  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX + 'px', y: event.clientY + 'px' };
    this.contextMenu.openMenu();
  }

  closeContextMenu() {
    this.contextMenu.closeMenu();
  }

  // ==================== SELECTION ====================
  isSelect = (row: any): boolean => this._selectedData().includes(row);
  isSelectAll = () => this.pageData().length > 0 && this.pageData().every(r => this.isSelect(r));

  toggleSelect = (row: any) => this.isSelect(row) ? this.deselect(row) : this.select(row);

  select = (row: any) => this._selectedData.set([...this._selectedData(), row]);
  deselect = (row: any) => this._selectedData.set(this._selectedData().filter(r => r !== row));

  selectAll = () => this._selectedData.set([...this.pageData()]);
  clearAll = () => this._selectedData.set([]);
  toggleAll = () => this.isSelectAll() ? this.clearAll() : this.selectAll();

  // ==================== KEYBOARD NAVIGATION ====================
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.pageData().length || !this.selectedData().length) return;

    const rows = this.pageData();
    const idx = rows.indexOf(this.selectedData()[0]);

    if (event.key === 'ArrowDown') {
      idx < rows.length - 1 ? this.selectAndScroll(idx + 1) : this.hasNextPage() && this.goToNextPage();
    } else if (event.key === 'ArrowUp') {
      idx > 0 ? this.selectAndScroll(idx - 1) : this.hasPrevPage() && this.goToPrevPage();
    }
  }

  private selectAndScroll(index: number) {
    this._selectedData.set([this.pageData()[index]]);
    this.scrollToRow(index);
  }

  // ==================== PAGINATION ====================
  hasNextPage = () => this.page() < Math.ceil(this.total() / this.pageSize());
  hasPrevPage = () => this.page() > 1;

  goToNextPage = () => this.onPageChange(this.page(), this.pageSize(), true);   // true = auto select
  goToPrevPage = () => this.onPageChange(this.page() - 2, this.pageSize(), true);

  // Chamado pelo paginator (não seleciona automaticamente)
  onPageChange(pageIndex: number, pageSize: number, autoSelect = false) {
    const newPage = pageIndex + 1;
    this._pageSize.set(pageSize);

    const loadPromise = this.endpoint()
      ? this.loadRemotePage(newPage, pageSize)
      : Promise.resolve(this.updatePageData(newPage));

    loadPromise.then(() => {
      if (!this.pageData().length) return;

      if (autoSelect) {
        const targetIdx = /* goToPrevPage */ this.page() > newPage ? this.pageData().length - 1 : 0;
        this._selectedData.set([this.pageData()[targetIdx]]);
        setTimeout(() => this.scrollToRow(targetIdx), 20);
      }
      // Se for do paginator (autoSelect = false) → mantém seleção anterior
    });
  }

  private updatePageData(page: number) {
    const start = (page - 1) * this._pageSize();
    this._pageData.set(this._fullData().slice(start, start + this._pageSize()));
    this._page.set(page);
  }

  private async loadRemotePage(page: number, pageSize: number) {
    this._loading.set(true);
    try {
      const res = await firstValueFrom(this._apiService.get<PaginatedResponse>(
        `${this._endpoint()}?page=${page}&per_page=${pageSize}`
      ));
      if (res) {
        this._pageData.set(res.data);
        this._total.set(res.total);
        this._page.set(res.current_page);
        this._pageSize.set(res.per_page);
      }
    } finally {
      this._loading.set(false);
    }
  }

  // ==================== SCROLL ====================
  private scrollToRow(index: number) {
    setTimeout(() => {
      const container = this.tableContainer.nativeElement;
      const rows = container.querySelectorAll('mat-row');

      if (index === rows.length - 1) {
        container.scrollTo({ top: container.scrollHeight, behavior: 'instant' });
      } else {
        rows[index]?.scrollIntoView({ 
          behavior: 'instant', 
          block: 'nearest' 
        });
      }
    }, 10);
  }
}