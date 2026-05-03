import { Injectable, signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '../../../../../services';   // ajuste o caminho

export interface PaginatedResponse {
  data: any[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class DataSource {

  private apiService = inject(ApiService);

  private _fullData = signal<any[]>([]);
  private _pageData = signal<any[]>([]);
  private _total = signal(0);
  private _page = signal(1);
  private _pageSize = signal(50);
  private _loading = signal(false);
  private _isRemote = signal(false);
  private _endpoint = signal<string>('');

  readonly pageData = this._pageData.asReadonly();
  readonly total = this._total.asReadonly();
  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly loading = this._loading.asReadonly();

  /** Configuração inicial */
  setData(data: any[] = [], endpoint?: string, pageSize = 50) {
    this._pageSize.set(pageSize);
    this._page.set(1);

    if (data?.length > 0) {
      // Modo Local
      this._isRemote.set(false);
      this._endpoint.set('');
      this._fullData.set([...data]);
      this._total.set(data.length);
      this.updatePageData(1);
    } else if (endpoint) {
      // Modo Laravel
      this._isRemote.set(true);
      this._endpoint.set(endpoint);
      this.loadRemotePage(1, pageSize);
    }
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
        this.apiService.get<PaginatedResponse>(
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

  /** Chamado pelo mat-paginator */
  onPageChange(pageIndex: number, pageSize: number) {
    const newPage = pageIndex + 1;
    this._pageSize.set(pageSize);

    if (this._isRemote()) {
      this.loadRemotePage(newPage, pageSize);
    } else {
      this.updatePageData(newPage);
    }
  }
}