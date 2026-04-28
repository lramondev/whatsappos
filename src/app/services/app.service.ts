import { Injectable, signal, inject, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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
    return new Promise((resolve, reject) => {
      //let app = this.storageService.get('app') as interfaces.App;
      //if(app) this.setApp(app);
      this.isLoading.emit(true);
      setTimeout(() => {
        this.themeService.setTheme(this.app().settings.theme, this.app().settings.dark);
        this.themeService.change.subscribe((theme: string, dark: boolean) => {
          let app = this.app();
          app.settings.theme = theme;
          app.settings.dark = dark;
          this.setApp(app);
        });
        this.isLoading.emit(false);
        resolve(this._app());
      }, 1000);
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

  logout(): void {
    this.authService.logout();
  }
}