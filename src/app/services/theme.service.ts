import { EventEmitter, Injectable, Output, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  @Output() 
  public change = new EventEmitter<{ theme: String,  dark: boolean }>();

  private renderer: Renderer2;
  private theme: string = '';
  private dark: boolean = false;

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  isDark = (): boolean => this.dark;

  toggle(): void {
    this.apply(this.theme, !this.dark);
  }

  setDark(): void {
    this.apply(this.theme, true);
  }

  setLight(): void {
    this.apply(this.theme, false);
  }

  setTheme(theme: string, dark: boolean): void {
    this.apply(theme, dark);
  }

  private apply(theme: string, dark: boolean): void {
    this.theme = theme;
    this.dark = dark;

    const html = document.documentElement;

    html.classList.forEach(cls => {
      if(cls.endsWith('-theme'))
        this.renderer.removeClass(html, cls);
    });
    
    this.renderer.addClass(html, this.theme);
    if(this.dark){
      this.renderer.addClass(html, 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      this.renderer.removeClass(html, 'dark');
      document.documentElement.style.colorScheme = 'light';
    }

    this.change.emit({ theme: this.theme, dark: this.dark });
  }
}