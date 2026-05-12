import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../../../services';

@Injectable({ providedIn: 'root' })
export class EmpresaService {

  private apiService = inject(ApiService);

  async save(formValue: any): Promise<any> {
    return this.apiService.post('/empresas', formValue);
  }
}