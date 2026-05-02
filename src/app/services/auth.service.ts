import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, EMPTY, tap, switchMap } from 'rxjs';

import { ApiService, StorageService } from '../services';
import { User, Token } from '../modules/system/user/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private router = inject(Router);
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private destroyRef = inject(DestroyRef);

  private _user = signal<User | null>(null);
  user = this._user.asReadonly();

  private readonly INACTIVITY_TIMEOUT = 5 * 60 * 1000;
  private inactivityTimer?: number;

  constructor() {
    this.initInactivityListener();
  }

  private initInactivityListener() {
    const reset = () => this.resetInactivityTimer();
    document.addEventListener('mousemove', reset, { passive: true });
    document.addEventListener('keydown', reset, { passive: true });

    window.addEventListener('storage', (e) => {
      if (e.key === 'lastActivity') reset();
    });

    this.destroyRef.onDestroy(() => this.clearInactivityTimer());
  }

  private resetInactivityTimer() {
    this.storageService.set('lastActivity', Date.now().toString());
    this.clearInactivityTimer();
    this.inactivityTimer = setTimeout(() => this.logout(), this.INACTIVITY_TIMEOUT) as unknown as number;
  }

  private clearInactivityTimer() {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }
  }

  refreshToken() {
    return this.apiService.post<{ token: Token }>('api/auth/refresh', {}).pipe(
      tap(res => {
        this.storageService.set('token', res.token);
      }),
      catchError(() => {
        this.logout();
        return EMPTY;
      })
    );
  }

  load() {
    const token = this.storageService.get('token') as Token;
    if (!token?.plainTextToken) {
      this.router.navigate(['/login']);
      return EMPTY;
    }

    return this.apiService.get('api/auth/me').pipe(
      tap((res: any) => {
        this._user.set(res.user);
        this.router.navigate(['/']);
        this.resetInactivityTimer();
      }),
      catchError(() => {
        this.logout();
        return EMPTY;
      })
    );
  }

  login(credentials: any) {
    return this.apiService.post('api/auth/login', credentials).pipe(
      tap((res: any) => {
        this.storageService.set('token', res.token);
        this._user.set(res.user);
        this.router.navigate(['/']);
        this.resetInactivityTimer();
      })
    );
  }

  logout(): void {
    this.clearInactivityTimer();
    this.storageService.remove('token');
    this.storageService.remove('lastActivity');
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}