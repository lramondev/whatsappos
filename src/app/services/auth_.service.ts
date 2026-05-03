import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap } from 'rxjs';

import { ApiService, StorageService } from '../services';

import { User, Token } from '../modules/system/user/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private router = inject(Router);
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);

  private _user = signal<User | null>(null);
  user = this._user.asReadonly();
  
  constructor() {

  }

  load() {
    const token = this.storageService.get('token') as Token;

    if (!token.plainTextToken) {
      this.router.navigate(['/login']);
      return EMPTY;
    }
    
    return this.apiService.get('auth/me').pipe(
      tap((res: any) => {
        this._user.set(res.user);
        this.router.navigate(['/']);
      }),
      catchError(() => {
        //this.router.navigate(['/login']);
        return EMPTY;
      })
    );
  }

  login(credentials: any) {
    return this.apiService.post('auth/login', credentials)
      .pipe(tap((res: any) => {
        this.storageService.set('token', res.token);
        this._user.set(res.user);
        this.router.navigate(['/']);
      }));
  }

  register(name: string, email: string, password: string) {
    return this.apiService.post('auth/register', { name, email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._user.set(null);
    this.router.navigate(['/login']);
  }

}