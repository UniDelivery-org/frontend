import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Default to dark mode as per design
  isDark = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load from local storage or default to true (dark)
      const savedTheme = localStorage.getItem('theme');
      this.isDark.set(savedTheme ? savedTheme === 'dark' : true);
      
      // Update HTML attribute whenever signal changes
      effect(() => {
        const isDark = this.isDark();
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
    }
  }

  toggle() {
    this.isDark.update(v => !v);
  }
}
