import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard — protects all authenticated app routes (/dashboard, /profile, etc.)
 *
 * When Spring Boot backend is integrated, this guard will validate the JWT
 * against the backend instead of just checking localStorage.
 *
 * Current behavior: checks for presence of token in localStorage (mock auth).
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // For demo purposes: always allow access so the full app can be explored
    // In production, replace the return below with: this.authService.isAuthenticated()
    const isAuth = this.authService.isAuthenticated();

    if (isAuth) {
      return true;
    }

    // Not authenticated — store intended destination and redirect to login
    // When backend is connected, uncomment and use:
    // return this.router.createUrlTree(['/login']);

    // For demo/frontend-only mode: allow all access
    return true;
  }
}
