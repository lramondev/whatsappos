import { Injectable, signal, computed, inject } from '@angular/core';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

import { ApiService } from '../services';
import { User } from '../modules/system/user/interfaces';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiService = inject(ApiService);
  private router = inject(Router);

  private _user = signal<User | null>(null);
  user = this._user.asReadonly();
  
  constructor() {

  }

  load() {
    /*return this.api.get('/auth/me').subscribe({
      next: (user: any) => this._user.set(user),
      error: () => this.logout()
    });*/
  }

  login(email: string, password: string) {
    return this.apiService.post('/auth/login', { email, password }).pipe(
      tap((res: any) => {
        localStorage.setItem('token', res.token);
        this._user.set(res.user);
      })
    );
  }

  register(name: string, email: string, password: string) {
    return this.apiService.post('/auth/register', { name, email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this._user.set(null);
    this.router.navigate(['/login']);
  }

}