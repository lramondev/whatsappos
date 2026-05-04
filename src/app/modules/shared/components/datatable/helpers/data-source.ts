import { signal, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '../../../../../services';

export interface PaginatedResponse {
  data: any[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export class DataSource {

  private _apiService = inject(ApiService);

  private _fullData = signal<any[]>([]);
  readonly fullData = this._fullData.asReadonly();

  private _pageData = signal<any[]>([]);
  readonly pageData = this._pageData.asReadonly();

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

  onPageChange(pageIndex: number, pageSize: number) {
    const newPage = pageIndex + 1;
    this._pageSize.set(pageSize);

    if (this.endpoint())
      this.loadRemotePage(newPage, pageSize);
    else 
      this.updatePageData(newPage);
  }
}