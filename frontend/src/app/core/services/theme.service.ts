import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Default: LIGHT theme
  private isDarkSubject = new BehaviorSubject<boolean>(false);
  public isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    const savedTheme = localStorage.getItem('careerai-theme');
    if (savedTheme) {
      // Respect user's previously saved choice
      this.setTheme(savedTheme === 'dark');
    } else {
      // First visit → Light theme by default, clear any previous dark classes
      this.setTheme(false);
    }
  }

  public toggleTheme(): void {
    this.setTheme(!this.isDarkSubject.value);
  }

  public setTheme(isDark: boolean): void {
    this.isDarkSubject.next(isDark);
    localStorage.setItem('careerai-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.remove('light-theme');
      // No class needed — :root already has light theme as default
    }
  }

  public get isDark(): boolean {
    return this.isDarkSubject.value;
  }
}
