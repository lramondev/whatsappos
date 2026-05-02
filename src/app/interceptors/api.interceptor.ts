import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { StorageService } from '../services';
import { Token } from '../modules/system/user/interfaces';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const storageService = inject(StorageService);
  const token = storageService.get('token') as Token;
  req = req.clone({ setHeaders: { Authorization: `Bearer ${token?.plainTextToken}` } });
  return next(req);
};