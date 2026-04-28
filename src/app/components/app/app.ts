import { Component, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppService } from '../../services';
import { App as AppInterface } from '../../interfaces';

@Component({
  selector: 'app-root',
  imports: [ 
    NgClass,
    RouterModule,
    RouterOutlet, 
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatRippleModule,
    MatProgressBarModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private appService = inject(AppService);

  app: AppInterface = this.appService.app();

  private _isLoading = signal(false);
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.appService.isLoading.subscribe((isLoading) => this._isLoading.set(isLoading));
  }

  toggleSidenav(): void {
    this.app.settings.left_sidenav_opened = !this.app.settings.left_sidenav_opened;
    this.appService.setApp(this.app);
  }

  logout(): void {
    this.appService.logout();
  }
}
