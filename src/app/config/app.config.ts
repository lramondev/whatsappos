import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter, withHashLocation } from '@angular/router';

import { MAT_ICON_DEFAULT_OPTIONS } from '@angular/material/icon';

import { provideNgxMask } from 'ngx-mask';

import { AppService } from '../services';
import { apiInterceptor } from '../interceptors';

import { routes } from '../routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([ apiInterceptor ])
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    {
      provide: MAT_ICON_DEFAULT_OPTIONS,
      useValue: { fontSet: 'material-symbols-outlined' }
    },
    provideAppInitializer(() => inject(AppService).load()),

    provideNgxMask()
  ]
};
