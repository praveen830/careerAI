import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthResponse, AuthUser, GoogleAuthRequest } from '../models';
import { StudentService } from './student.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'careerai_jwt';
  private readonly USER_KEY = 'careerai_user';
  private readonly apiUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  public currentUser$: Observable<AuthUser | null> = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private studentService: StudentService
  ) {}

  /**
   * Authenticate with Google Identity Services (GIS) ID token.
   * Sends the Google ID token to the Spring Boot backend endpoint:
   * POST /api/auth/google
   *
   * The backend verifies the token using Google API Client libraries,
   * finds or creates the student account, and returns the application's JWT.
   */
  public googleLogin(idToken: string): Observable<AuthResponse> {
    const payload: GoogleAuthRequest = { idToken };
    const url = `${this.apiUrl}/auth/google`;

    return this.http.post<AuthResponse>(url, payload).pipe(
      tap((res: AuthResponse) => {
        if (!res || !res.token) {
          throw new Error('Invalid authentication response from server: Missing JWT token.');
        }
        this.handleAuthSuccess(res);
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('Google login verification failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Standard email and password login.
   * Sends credentials to Spring Boot backend: POST /api/auth/login
   */
  public login(email: string, password: string): Observable<AuthResponse> {
    const url = `${this.apiUrl}/auth/login`;
    return this.http.post<AuthResponse>(url, { email, password }).pipe(
      tap((res: AuthResponse) => {
        this.handleAuthSuccess(res);
      }),
      catchError((error: HttpErrorResponse | Error) => {
        console.error('Login request failed:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Save session data after successful authentication.
   * Saves application JWT to localStorage (NOT the Google ID token).
   */
  public handleAuthSuccess(response: any): void {
    const data = response?.data ? response.data : response;
    const token = data?.token || data?.accessToken;
    const user = data?.user || (data?.email ? data : null);

    if (token) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      this.currentUserSubject.next(user);

      // Sync student profile in StudentService if user information is provided
      this.studentService.updateProfile({
        fullName: user.fullName || user.name || 'Student',
        email: user.email,
        careerGoal: user.careerGoal || 'Java Full Stack Developer'
      });
    }
  }

  /**
   * Returns the stored application JWT for HTTP requests.
   */
  public getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Checks if user has a stored application JWT.
   */
  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Returns the current authenticated student user.
   */
  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  /**
   * Log out the current user and redirect to login page.
   */
  public logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  private getStoredUser(): AuthUser | null {
    try {
      const stored = localStorage.getItem(this.USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
