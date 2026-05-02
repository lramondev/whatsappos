import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';

import { ThemeService } from '../../services';

@Component({
  selector: 'app-profile',
  imports: [ 
    CommonModule,
    MatSlideToggleModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatSelectModule,
    MatGridListModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {

  private themeService = inject(ThemeService);

  theme = this.themeService.getTheme();
  themes = this.themeService.themes;
  
  toggle(): void {
    this.themeService.toggle();
  }

  changeTheme(theme: string): void {
    this.themeService.setTheme(theme, this.isDark());
  }

  isDark = (): boolean => this.themeService.isDark();

}
