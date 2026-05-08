import { Injectable, signal, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import * as services from '../services';
import * as interfaces from '../interfaces';
import * as data from '../data';

@Injectable({ providedIn: 'root' })
export class AppService {

  /* 
    this.router.events.subscribe((event) => {
      if(event instanceof RouteConfigLoadStart || event instanceof NavigationStart)
        console.log('start');
      else if (event instanceof RouteConfigLoadEnd || event instanceof NavigationEnd)
        console.log('end');
    });
  */

  @Output() 
  public isLoading = new EventEmitter<boolean>();

  private router = inject(Router);

  private storageService = inject(services.StorageService);
  private themeService = inject(services.ThemeService);
  private authService = inject(services.AuthService);

  private _app = signal<interfaces.App>(data.AppData);
  readonly app = this._app.asReadonly();

  load(): Promise<interfaces.App> {
    return new Promise(async (resolve) => {
      this.isLoading.emit(true);
      this.themeService.setTheme(this.app().settings.theme, this.app().settings.dark);
      return firstValueFrom(this.authService.load()).then(() => {
          this.isLoading.emit(false);
          resolve(this._app());
        }).catch(() => {
          this.isLoading.emit(false);
          resolve(this._app());
        });
    });
  }

  setApp(app: interfaces.App) {
    this._app.set(app);
    this.storageService.set('app', this.app());
  }

  getModule(): interfaces.Module {
    let url = this.router.url.split('/').filter(Boolean);
    let current = this._app().modules.find((m: interfaces.Module) => m.route == url[0]) as interfaces.Module;
    if(current && url.length > 1)
      current = current.resources?.find((r: interfaces.Module) => r.route == url[1]) as interfaces.Module;
    return current;
  }

  nav(url: string): void {
    this.router.navigate([ '/' + url ])
  }

  logout(): void {
    this.authService.logout();
  }
}