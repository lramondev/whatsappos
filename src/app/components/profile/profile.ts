import { Component, inject } from '@angular/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';

import { ThemeService } from '../../services';

@Component({
  selector: 'app-profile',
  imports: [ 
    MatSlideToggleModule, 
    MatCardModule 
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  private themeService = inject(ThemeService);
  
  toggle(): void {
    this.themeService.toggle();
  }

  isDark = (): boolean => this.themeService.isDark();

}
