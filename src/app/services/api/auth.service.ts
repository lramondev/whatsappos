import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { catchError, EMPTY, tap, switchMap } from 'rxjs';

import { ApiService } from './api.service';
import { StorageService } from '../utils';

import { User, Token } from '../../modules/system/user/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private router = inject(Router);
  private matDialog = inject(MatDialog);
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);
  private destroyRef = inject(DestroyRef);

  private _user = signal<User | null>(null);
  user = this._user.asReadonly();

  private _remember = signal<boolean>(false);
  remember = this._remember.asReadonly();

  private readonly REFRESH_TIMEOUT = 9 * 60 * 1000;
  private refreshTimer?: any;
  private readonly INACTIVITY_TIMEOUT = 10 * 60 * 1000;
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

  private clearTokenRefresh() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
      this.refreshTimer = undefined;
    }
  }

  startTokenRefresh() {
    this.clearTokenRefresh();
    this.refreshTimer = setInterval(() => {
      if (this.user()) {
        this.refreshToken().subscribe();
      }
    }, this.REFRESH_TIMEOUT);
  }

  refreshToken() {
    return this.apiService.post<{ token: Token }>('auth/refresh', {}).pipe(
      tap(res => {
        this.storageService.set('token', res.token);
      }),
      catchError(() => {
        return EMPTY;
      })
    );
  }

  load() {
    const token = this.storageService.get('token') as Token;
    const remember = this.storageService.get('remember') as boolean;
    this._remember.set(remember);
    if (!token?.plainTextToken) {
      this.router.navigate(['/login']);
      return EMPTY;
    }

    return this.apiService.get('auth/me').pipe(
      tap((res: any) => {
        this._user.set(res.user);
        this.resetInactivityTimer();
        this.startTokenRefresh();
        if (this.router.url === '/login')
          this.router.navigate(['/']);
      }),
      catchError(() => {
        return EMPTY;
      })
    );
  }

  login(credentials: { email: string; password: string; remember: boolean }) {
    return this.apiService.post('auth/login', {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      tap((res: any) => {
        const remember = credentials.remember;
        this.storageService.set('token', res.token);
        this.storageService.set('remember', remember);
        this._remember.set(remember);
        this._user.set(res.user);
        this.resetInactivityTimer();
        this.startTokenRefresh();
        this.router.navigate(['/']);
      })
    );
  }

  logout(): void {
    this.matDialog.closeAll();
    this.clearInactivityTimer();
    this.storageService.remove('token');
    this.storageService.remove('lastActivity');
    this._user.set(null);
    this.router.navigate(['/login']);
  }
}