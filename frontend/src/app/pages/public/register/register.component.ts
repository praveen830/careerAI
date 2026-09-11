import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { StudentService } from '../../../core/services/student.service';
import { AuthService } from '../../../core/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-split-page">
      <!-- Left Column: Branding & Value Proposition -->
      <div class="auth-brand-pane">
        <div class="brand-pane-inner">
          <div class="brand-top">
            <a routerLink="/" class="brand-logo-link">
              <div class="brand-badge-glow">
                <app-icon name="sparkles" [size]="22"></app-icon>
              </div>
              <span class="brand-name">Career<span class="text-gradient">AI</span></span>
            </a>
          </div>

          <div class="brand-headline-block">
            <div class="brand-tag">
              <span class="pulse-dot"></span>
              <span>Student Career Readiness</span>
            </div>
            <h1 class="brand-title">Start with clarity. Graduate with confidence.</h1>
            <p class="brand-subtitle">
              Join thousands of students who know exactly which skills to learn, which projects to build, and how to reach their target career roles.
            </p>
          </div>

          <!-- Feature Benefit Cards Visual -->
          <div class="benefits-visual">
            <div class="benefit-card glass-card">
              <div class="b-icon primary">
                <app-icon name="target" [size]="18"></app-icon>
              </div>
              <div class="b-content">
                <h4 class="b-title">Role-Aligned Benchmarks</h4>
                <p class="b-desc">Compare your current skills with industry standards for 100+ tech career paths.</p>
              </div>
            </div>

            <div class="benefit-card glass-card">
              <div class="b-icon warning">
                <app-icon name="bar-chart-2" [size]="18"></app-icon>
              </div>
              <div class="b-content">
                <h4 class="b-title">Precise Skill Gap Analysis</h4>
                <p class="b-desc">Identify critical bottlenecks and high-priority gaps before recruiter screenings.</p>
              </div>
            </div>

            <div class="benefit-card glass-card">
              <div class="b-icon success">
                <app-icon name="compass" [size]="18"></app-icon>
              </div>
              <div class="b-content">
                <h4 class="b-title">Milestone Roadmap</h4>
                <p class="b-desc">Follow step-by-step interactive stages from fundamentals to cloud deployment.</p>
              </div>
            </div>
          </div>

          <!-- Bottom Trust Metric -->
          <div class="brand-footer-metrics">
            <div class="f-metric">
              <span class="f-val">68%</span>
              <span class="f-lbl">Avg Starting Readiness</span>
            </div>
            <div class="f-sep"></div>
            <div class="f-metric">
              <span class="f-val">+22%</span>
              <span class="f-lbl">Growth in 30 Days</span>
            </div>
            <div class="f-sep"></div>
            <div class="f-metric">
              <span class="f-val">Free</span>
              <span class="f-lbl">For All Students</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Registration Card -->
      <div class="auth-form-pane">
        <div class="auth-card glass-card">
          <!-- Header -->
          <div class="auth-header text-center">
            <div class="auth-logo">
              <app-icon name="sparkles" [size]="24"></app-icon>
            </div>
            <h2>Create Your Account</h2>
            <p class="auth-subtitle">Start building a clearer path toward your career goals.</p>
          </div>

          <!-- Google Error Alert -->
          <div *ngIf="googleAuthError" class="auth-alert danger-alert" role="alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <p class="alert-title">Notice</p>
              <p class="alert-desc">{{ googleAuthError }}</p>
            </div>
            <button type="button" class="alert-close" (click)="googleAuthError = null">✕</button>
          </div>

          <!-- Google Identity Services Sign-Up Button -->
          <div class="google-btn-section" [class.is-busy]="googleLoading">
            <div #googleBtnContainer id="googleRegisterBtn" class="google-btn-container"></div>
          </div>

          <div class="auth-divider">
            <span>OR REGISTER WITH COLLEGE EMAIL</span>
          </div>

          <!-- Register Form with Inline Validation -->
          <form (ngSubmit)="onRegister()" class="auth-form" novalidate>
            <!-- Full Name -->
            <div class="form-group">
              <label class="form-label" for="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                class="form-control"
                [(ngModel)]="fullName"
                placeholder="e.g. Praveen Kumar"
                [class.is-invalid]="submitted && fullNameError"
              />
              <div class="form-error" *ngIf="submitted && fullNameError">
                {{ fullNameError }}
              </div>
            </div>

            <!-- Email -->
            <div class="form-group">
              <label class="form-label" for="email">College Email</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-control"
                [(ngModel)]="email"
                placeholder="praveen@nitk.edu.in"
                [class.is-invalid]="submitted && emailError"
              />
              <div class="form-error" *ngIf="submitted && emailError">
                {{ emailError }}
              </div>
            </div>

            <!-- Password -->
            <div class="form-group">
              <label class="form-label" for="password">Password</label>
              <div class="password-input-wrap">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  class="form-control"
                  [(ngModel)]="password"
                  (input)="calculateStrength()"
                  placeholder="Create secure password (min 6 characters)"
                  [class.is-invalid]="submitted && passwordError"
                />
                <button type="button" class="pwd-toggle" (click)="showPassword = !showPassword" aria-label="Toggle password visibility">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>

              <!-- Password Strength Bar -->
              <div class="strength-meter" *ngIf="password">
                <div class="strength-bars">
                  <div class="s-bar" [class.active]="strengthScore >= 1" [ngClass]="strengthColor"></div>
                  <div class="s-bar" [class.active]="strengthScore >= 2" [ngClass]="strengthColor"></div>
                  <div class="s-bar" [class.active]="strengthScore >= 3" [ngClass]="strengthColor"></div>
                  <div class="s-bar" [class.active]="strengthScore >= 4" [ngClass]="strengthColor"></div>
                </div>
                <span class="strength-label" [ngClass]="strengthColor">{{ strengthLabel }}</span>
              </div>

              <div class="form-error" *ngIf="submitted && passwordError">
                {{ passwordError }}
              </div>
            </div>

            <!-- Confirm Password -->
            <div class="form-group">
              <label class="form-label" for="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                class="form-control"
                [(ngModel)]="confirmPassword"
                placeholder="Repeat your password"
                [class.is-invalid]="submitted && confirmError"
              />
              <div class="form-error" *ngIf="submitted && confirmError">
                {{ confirmError }}
              </div>
            </div>

            <!-- Submit Button with Simulated Loading State -->
            <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="loading || googleLoading">
              <span *ngIf="!loading">Create Account</span>
              <span *ngIf="loading" class="btn-spinner-wrap">
                <span class="btn-spinner"></span>
                <span>Creating your account...</span>
              </span>
            </button>
          </form>

          <!-- Login Link -->
          <div class="auth-footer text-center">
            <p>Already have an account? <a routerLink="/login" class="login-link font-semibold">Login</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-split-page {
      min-height: calc(100vh - 72px);
      display: flex;
      width: 100%;
      background: #f8faff;
    }

    /* Left Pane — Clean light indigo style */
    .auth-brand-pane {
      flex: 1.1;
      background: linear-gradient(145deg, #eef2ff 0%, #f0f4ff 50%, #faf5ff 100%);
      border-right: 1px solid #e0e7ff;
      padding: 3.5rem 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }
    .brand-pane-inner {
      max-width: 540px;
      margin: 0 auto;
      width: 100%;
      position: relative;
      z-index: 2;
    }
    .brand-logo-link {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
      margin-bottom: 2rem;
    }
    .brand-badge-glow {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.5);
    }
    .brand-name {
      font-size: 1.4rem;
      font-weight: 800;
      color: var(--text-primary);
    }
    .brand-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      color: #4f46e5;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4f46e5;
      box-shadow: 0 0 8px rgba(79,70,229,0.5);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.6; }
    }
    .brand-title {
      font-size: 2.1rem;
      font-weight: 800;
      line-height: 1.2;
      margin-bottom: 0.85rem;
      color: #1e1b4b;
    }
    .brand-subtitle {
      font-size: 0.975rem;
      color: #4c5270;
      line-height: 1.65;
      margin-bottom: 2.25rem;
    }

    /* Benefits visual */
    .benefits-visual {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 2.5rem;
    }
    .benefit-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      background: #ffffff;
      border: 1px solid #e0e7ff;
      box-shadow: 0 2px 8px rgba(79,70,229,0.06);
      transition: transform var(--transition-fast), box-shadow var(--transition-fast);
    }
    .benefit-card:hover {
      transform: translateX(4px);
      box-shadow: 0 4px 16px rgba(79,70,229,0.1);
    }
    .b-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .b-icon.primary { background: rgba(99, 102, 241, 0.2); color: var(--primary); }
    .b-icon.warning { background: rgba(245, 158, 11, 0.2); color: var(--warning); }
    .b-icon.success { background: rgba(16, 185, 129, 0.2); color: var(--success); }
    .b-title {
      font-size: 0.92rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.2rem 0;
    }
    .b-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.4;
    }

    .brand-footer-metrics {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 1.5rem;
      border-top: 1px solid #e0e7ff;
    }
    .f-metric { display: flex; flex-direction: column; }
    .f-val { font-size: 1.15rem; font-weight: 800; color: #1e1b4b; }
    .f-lbl { font-size: 0.72rem; color: #6b7280; }
    .f-sep { width: 1px; height: 24px; background: #e0e7ff; }

    /* Right Pane */
    .auth-form-pane {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
    }
    .auth-card {
      width: 100%;
      max-width: 480px;
      padding: 2.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
      border-radius: var(--radius-lg);
    }
    .auth-logo {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      background: var(--gradient-primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      margin-bottom: 1rem;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
    }
    .auth-header h2 { font-size: 1.65rem; margin-bottom: 0.35rem; }
    .auth-subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.5rem; }

    .google-btn-section {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 44px;
      width: 100%;
      margin-bottom: 0.5rem;
    }
    .google-btn-section.is-busy { opacity: 0.5; pointer-events: none; }
    .google-btn-container { width: 100%; display: flex; justify-content: center; }

    .auth-alert {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
    }
    .danger-alert { background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); color: #fca5a5; }
    .alert-icon { font-size: 1.1rem; flex-shrink: 0; }
    .alert-content { flex: 1; }
    .alert-title { font-weight: 600; color: #f87171; margin-bottom: 0.2rem; }
    .alert-desc { font-size: 0.8rem; color: #fecaca; }
    .alert-close { background: none; border: none; color: #f87171; font-size: 1rem; cursor: pointer; }

    .auth-divider {
      position: relative;
      text-align: center;
      margin: 1.25rem 0;
    }
    .auth-divider::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      right: 0;
      height: 1px;
      background: var(--border-subtle);
    }
    .auth-divider span {
      position: relative;
      background: var(--bg-surface);
      padding: 0 0.75rem;
      font-size: 0.72rem;
      color: var(--text-muted);
      letter-spacing: 0.04em;
    }

    .password-input-wrap { position: relative; }
    .pwd-toggle {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.75rem;
      color: var(--text-muted);
      font-weight: 600;
      background: none;
      border: none;
      cursor: pointer;
    }

    .strength-meter {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.45rem;
    }
    .strength-bars {
      display: flex;
      gap: 4px;
      flex: 1;
      max-width: 180px;
    }
    .s-bar {
      height: 4px;
      flex: 1;
      background: var(--bg-surface-elevated);
      border-radius: 2px;
      transition: background 0.2s ease;
    }
    .s-bar.active.weak { background: var(--danger); }
    .s-bar.active.fair { background: var(--warning); }
    .s-bar.active.good { background: var(--accent-cyan); }
    .s-bar.active.strong { background: var(--success); }
    .strength-label { font-size: 0.75rem; font-weight: 600; }
    .strength-label.weak { color: var(--danger); }
    .strength-label.fair { color: var(--warning); }
    .strength-label.good { color: var(--accent-cyan); }
    .strength-label.strong { color: var(--success); }

    .submit-btn { width: 100%; margin-top: 1rem; }
    .btn-spinner-wrap {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-footer {
      border-top: 1px solid var(--border-subtle);
      padding-top: 1.25rem;
      margin-top: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .login-link { color: var(--primary); }
    .login-link:hover { text-decoration: underline; }
    .is-invalid { border-color: var(--danger) !important; }

    /* Responsive */
    @media (max-width: 960px) {
      .auth-split-page {
        flex-direction: column;
      }
      .auth-brand-pane {
        padding: 2.5rem 1.5rem;
        border-right: none;
        border-bottom: 1px solid var(--border-subtle);
      }
      .brand-title {
        font-size: 1.85rem;
      }
      .benefits-visual {
        display: none;
      }
      .auth-form-pane {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class RegisterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('googleBtnContainer', { static: false })
  public googleBtnContainer!: ElementRef<HTMLDivElement>;

  public fullName: string = '';
  public email: string = '';
  public password: string = '';
  public confirmPassword: string = '';
  public showPassword: boolean = false;
  public submitted: boolean = false;
  public loading: boolean = false;

  // Validation Error Messages
  public fullNameError: string | null = null;
  public emailError: string | null = null;
  public passwordError: string | null = null;
  public confirmError: string | null = null;

  public strengthScore: number = 0;
  public strengthLabel: string = '';
  public strengthColor: string = '';

  // Google State
  public googleLoading: boolean = false;
  public googleAuthError: string | null = null;
  private googleInitialized: boolean = false;
  private gisPollTimer: any = null;

  constructor(
    private router: Router,
    private studentService: StudentService,
    private authService: AuthService,
    private ngZone: NgZone
  ) {}

  ngAfterViewInit(): void {
    this.setupGoogleIdentityServices();
  }

  ngOnDestroy(): void {
    if (this.gisPollTimer) {
      clearInterval(this.gisPollTimer);
      this.gisPollTimer = null;
    }
  }

  private setupGoogleIdentityServices(): void {
    if (this.googleInitialized) return;

    if (typeof google !== 'undefined' && google?.accounts?.id) {
      this.initializeGisButton();
    } else {
      let attempts = 0;
      this.gisPollTimer = setInterval(() => {
        attempts++;
        if (typeof google !== 'undefined' && google?.accounts?.id) {
          clearInterval(this.gisPollTimer);
          this.gisPollTimer = null;
          this.initializeGisButton();
        } else if (attempts > 35) {
          clearInterval(this.gisPollTimer);
          this.gisPollTimer = null;
        }
      }, 150);
    }
  }

  private initializeGisButton(): void {
    if (this.googleInitialized || !this.googleBtnContainer?.nativeElement) return;

    try {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (response: any) => this.handleGoogleCredentialResponse(response),
        auto_select: false,
        cancel_on_tap_outside: true
      });

      this.googleBtnContainer.nativeElement.innerHTML = '';

      google.accounts.id.renderButton(this.googleBtnContainer.nativeElement, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'signup_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        width: 360
      });

      this.googleInitialized = true;
    } catch (err) {
      console.warn('GIS register button render:', err);
    }
  }

  public handleGoogleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      if (!response || !response.credential) {
        this.googleAuthError = 'Google sign-up was cancelled or returned no ID token.';
        return;
      }

      this.googleLoading = true;
      this.googleAuthError = null;

      setTimeout(() => {
        this.googleLoading = false;
        this.router.navigate(['/dashboard']);
      }, 600);
    });
  }

  public calculateStrength(): void {
    const p = this.password;
    if (!p) {
      this.strengthScore = 0;
      this.strengthLabel = '';
      this.strengthColor = '';
      return;
    }

    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    this.strengthScore = score;
    if (score <= 1) {
      this.strengthLabel = 'Weak';
      this.strengthColor = 'weak';
    } else if (score === 2) {
      this.strengthLabel = 'Fair';
      this.strengthColor = 'fair';
    } else if (score === 3) {
      this.strengthLabel = 'Good';
      this.strengthColor = 'good';
    } else {
      this.strengthLabel = 'Strong';
      this.strengthColor = 'strong';
    }
  }

  /**
   * Simulated frontend registration with inline validations
   */
  public onRegister(): void {
    this.submitted = true;
    this.fullNameError = null;
    this.emailError = null;
    this.passwordError = null;
    this.confirmError = null;

    let hasError = false;

    // Full name validation
    if (!this.fullName || !this.fullName.trim()) {
      this.fullNameError = 'Please enter your full name';
      hasError = true;
    }

    // Email validation
    if (!this.email || !this.email.trim()) {
      this.emailError = 'Please enter your email';
      hasError = true;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.emailError = 'Please enter a valid email';
        hasError = true;
      }
    }

    // Password validation
    if (!this.password) {
      this.passwordError = 'Please enter a password';
      hasError = true;
    } else if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      hasError = true;
    }

    // Confirm password validation
    if (!this.confirmPassword) {
      this.confirmError = 'Please confirm your password';
      hasError = true;
    } else if (this.password !== this.confirmPassword) {
      this.confirmError = 'Passwords do not match';
      hasError = true;
    }

    if (hasError) return;

    // Simulate registration loading: "Creating your account..."
    this.loading = true;
    setTimeout(() => {
      this.studentService.updateProfile({
        fullName: this.fullName,
        email: this.email,
        careerGoal: 'Java Full Stack Developer'
      });
      this.loading = false;
      this.router.navigate(['/dashboard']);
    }, 600);
  }
}
