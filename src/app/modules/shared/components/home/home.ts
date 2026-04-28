import { Component, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

import * as services from '../../../../services';
import * as interfaces from  '../../../../interfaces';

@Component({
  selector: 'home',
  imports: [ MatCardModule, MatListModule, RouterModule, MatIconModule, MatGridListModule ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {

  private appService = inject(services.AppService);
  private _module = signal<interfaces.Module>(this.appService.getModule());
  public readonly module = this._module.asReadonly();

  constructor() {

  }
  
}
