import { Component, computed, ElementRef, EventEmitter, HostListener, inject, Output, signal, ViewChild } from '@angular/core';
import { NgStyle, NgIf } from '@angular/common';
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

import { Column as ColumnInterface, Action as ActionInterface, Action } from '../../interfaces';

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
    MatProgressBarModule, MatButtonModule, MatCheckboxModule, MatBadgeModule, MatTabsModule, MatMenuModule, MatDividerModule, MatIconModule, NgStyle,
    NgxMaskPipe
],
  templateUrl: './datatable.html',
  styleUrl: './datatable.scss',
})
export class Datatable {

  @ViewChild('contextMenu', { static: true }) 
  contextMenu!: MatMenuTrigger;

  @Output()
  onAction: EventEmitter<Action> = new EventEmitter();


  @ViewChild('tableContainer', { static: false }) 
  tableContainer!: ElementRef<HTMLDivElement>;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.pageData().length || this.selectedData().length === 0) return;

    const rows = this.pageData();
    const currentIndex = rows.indexOf(this.selectedData()[0]);

    if (event.key === 'ArrowDown') {
      if (currentIndex < rows.length - 1) {
        this.selectAndScroll(currentIndex + 1);
      } else if (this.hasNextPage()) {
        this.goToNextPage();
      }
    } 
    else if (event.key === 'ArrowUp') {
      if (currentIndex > 0) {
        this.selectAndScroll(currentIndex - 1);
      } else if (this.hasPrevPage()) {
        this.goToPrevPage();
      }
    }
  }

  private _apiService = inject(ApiService);

  private _columns = signal<ColumnInterface[]>([]);
  private _actions = signal<ActionInterface[]>([]);

  private _isLoading = signal<boolean>(false);
  readonly isLoading = this._isLoading.asReadonly();

  readonly columns = this._columns.asReadonly();
  readonly visibleColumns = computed(() => 
  this._columns().filter(c => c.visible).map(c => c.column_def));
  
  readonly actions = this._actions.asReadonly();
  
  // data
  private _fullData = signal<any[]>([]);
  readonly fullData = this._fullData.asReadonly();

  private _pageData = signal<any[]>([]);
  readonly pageData = this._pageData.asReadonly();

  private _selectedData = signal<any[]>([]);
  readonly selectedData = this._selectedData.asReadonly();

  private _total = signal(0);
  readonly total = this._total.asReadonly();

  private _page = signal(1);
  readonly page = this._page.asReadonly();

  private _pageSize = signal(20);
  readonly pageSize = this._pageSize.asReadonly();

  private _pageSizeOptons = signal([20, 100, 500, 1000]);
  readonly pageSizeOptons = this._pageSizeOptons.asReadonly();

  private _loading = signal(false);
  readonly loading = this._loading.asReadonly();

  private _endpoint = signal<string>('');
  readonly endpoint = this._endpoint.asReadonly();

  contextMenuPosition = { x: '0px', y: '0px' };
  selectedRowForMenu: any = null;

  setConfig(
    columns: ColumnInterface[],
    actions: ActionInterface[] = [],
    data: any[] = [],
    endpoint?: string
  ) {
    this._columns.set(columns);
    this._actions.set(actions);
    this.setData(data, endpoint);
  }

  setData(data: any[] = [], endpoint?: string, pageSize = 20) {
    this._pageSize.set(pageSize);
    this._page.set(1);

    if (data?.length > 0) {
      this._endpoint.set('');
      this._fullData.set([...data]);
      this._total.set(data.length);
      this.updatePageData(1);
    } else if (endpoint) {
      this._endpoint.set(endpoint);
      this.loadRemotePage(1, pageSize);
    }
  }

  onContextMenu(event: MouseEvent, row: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu?.openMenu();
  }

  closeContextMenu() {
    this.contextMenu.closeMenu();
  }

  // select
  isSelect = (row: any): boolean => this._selectedData().includes(row);
  isSelectAll = () => this.pageData().length > 0 && this.pageData().every(row => this.isSelect(row));
  select = (row: any) => this._selectedData.set([...this._selectedData(), row]);
  desselect = (row: any) => this._selectedData.set(this._selectedData().filter(r => r !== row))
  
  toggleSelect = (row: any) => this.isSelect(row) ? 
    this._selectedData.set(this._selectedData().filter(r => r !== row)) : 
    this._selectedData.set([...this._selectedData(), row]);

  toggleAll = () => this.isSelectAll() ? this.clearAll() : this._selectedData.set([...this.pageData()]);
  selectAll = () => this._selectedData.set([...this.pageData()]);
  clearAll = () => this._selectedData.set([]);

  // page
  hasNextPage() { return this.page() < Math.ceil(this.total() / this.pageSize()); }
  hasPrevPage() { return this.page() > 1; }

  goToNextPage() {
    this.onPageChange(this.page(), this.pageSize(), false); // false = primeira linha
  }

  goToPrevPage() {
    this.onPageChange(this.page() - 2, this.pageSize(), true); // true = última linha
  }

  onPageChange(pageIndex: number, pageSize: number, goToLast: boolean = false) {
    const newPage = pageIndex + 1;
    this._pageSize.set(pageSize);

    const loadPromise = this.endpoint() 
      ? this.loadRemotePage(newPage, pageSize) 
      : Promise.resolve(this.updatePageData(newPage));

    loadPromise.then(() => {
      if (this.pageData().length === 0) return;

      const targetIndex = goToLast ? this.pageData().length - 1 : 0;
      this._selectedData.set([this.pageData()[targetIndex]]);

      setTimeout(() => {
        const container = this.tableContainer.nativeElement;
        
        if (goToLast) {
          container.scrollTo({ top: container.scrollHeight, behavior: 'instant' });
        } else {
          container.scrollTo({ top: 0, behavior: 'instant' });
        }
      }, 20);
    });
  }

  private scrollToRow(index: number, toTop: boolean = false) {
    const container = this.tableContainer.nativeElement;
    const rows = container.querySelectorAll('mat-row');

    if (toTop) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (index === rows.length - 1) {
      // Última linha da página anterior → scroll para o final
      container.scrollTo({ 
        top: container.scrollHeight, 
        //behavior: 'smooth' 
      });
    } else {
      rows[index]?.scrollIntoView({ 
        //behavior: 'smooth', 
        block: 'nearest' 
      });
    }
  }

  private selectAndScroll(index: number) {
    this._selectedData.set([this.pageData()[index]]);
    setTimeout(() => this.scrollToRow(index), 10);
  }
      
  private updatePageData(page: number) {
    const start = (page - 1) * this._pageSize();
    const end = start + this._pageSize();
    this._pageData.set(this._fullData().slice(start, end));
    this._page.set(page);
  }
  
  private async loadRemotePage(page: number, pageSize: number) {
    this._loading.set(true);
    try {
      const res = await firstValueFrom(
        this._apiService.get<PaginatedResponse>(
          `${this._endpoint()}?page=${page}&per_page=${pageSize}`
        )
      );

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
}