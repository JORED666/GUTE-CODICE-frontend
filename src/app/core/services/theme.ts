import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private darkMode = false;

  constructor() {
    const saved = localStorage.getItem('darkMode');
    if (saved === 'true') {
      this.darkMode = true;
      document.body.classList.add('dark');
    }
  }

  isDark(): boolean {
    return this.darkMode;
  }

  toggle() {
    this.darkMode = !this.darkMode;
    if (this.darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('darkMode', String(this.darkMode));
  }
}