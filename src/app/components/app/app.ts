import { Component, HostListener, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppService, AuthService } from '../../services';
import { App as AppInterface } from '../../interfaces';
import { User as UserInterface } from '../../modules/system/user/interfaces';

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

  @HostListener('document:contextmenu', ['$event'])
  onContextMenu(event: MouseEvent) {
    //event.preventDefault();
    //event.stopImmediatePropagation();
  }

  private appService = inject(AppService);
  private authService = inject(AuthService);

  app: AppInterface = this.appService.app();
  user: UserInterface | null  = this.authService.user();

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
