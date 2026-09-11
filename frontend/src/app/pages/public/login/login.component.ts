import { Component, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../core/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-split-page">
      <!-- Left Column: Branding & AI Career Visual -->
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
              <span>AI Career Intelligence Platform</span>
            </div>
            <h1 class="brand-title">Build your career with clarity.</h1>
            <p class="brand-subtitle">
              Understand your skills, discover your gaps, and follow a personalized path toward your dream career.
            </p>
          </div>

          <!-- Abstract AI / Career Visual Graphic with Interactive Track Switcher -->
          <div class="ai-career-visual">
            <div class="visual-ambient-orb orb-1"></div>
            <div class="visual-ambient-orb orb-2"></div>

            <!-- Track Toggle Tabs -->
            <div class="visual-track-tabs">
              <button
                *ngFor="let t of tracks; let i = index"
                type="button"
                class="track-tab-btn"
                [class.active]="selectedTrackIndex === i"
                (click)="selectedTrackIndex = i"
              >
                {{ t.tabLabel }}
              </button>
            </div>

            <!-- Central AI Analytics Node -->
            <div class="visual-card center-radar-card glass-card">
              <div class="radar-header">
                <div class="radar-icon">
                  <app-icon name="target" [size]="18"></app-icon>
                </div>
                <div>
                  <span class="radar-label">Target Role Benchmark</span>
                  <h4 class="radar-role">{{ currentTrack.name }}</h4>
                </div>
                <span class="badge badge-success">{{ currentTrack.badge }}</span>
              </div>
              <!-- Simulated mini analytics bars -->
              <div class="mini-metrics-row">
                <div class="mini-metric" *ngFor="let m of currentTrack.skills">
                  <span class="metric-name">{{ m.name }}</span>
                  <div class="mini-bar-track">
                    <div class="mini-bar-fill" [ngClass]="m.color" [style.width.%]="m.pct"></div>
                  </div>
                  <span class="metric-val" [ngClass]="m.color">{{ m.pct }}%</span>
                </div>
              </div>
            </div>

            <!-- Floating Skill Pill 1: Skill Gap Alert -->
            <div class="floating-chip gap-chip glass-card">
              <span class="chip-dot warning"></span>
              <div class="chip-text">
                <span class="chip-title">Biggest Skill Gap</span>
                <span class="chip-val">{{ currentTrack.gap }}</span>
              </div>
            </div>

            <!-- Floating Skill Pill 2: Career Readiness -->
            <div class="floating-chip readiness-chip glass-card">
              <span class="chip-dot primary"></span>
              <div class="chip-text">
                <span class="chip-title">Career Readiness</span>
                <span class="chip-val text-gradient font-bold">{{ currentTrack.readiness }}</span>
              </div>
            </div>

            <!-- Floating Skill Pill 3: Next Step Action -->
            <div class="floating-chip action-chip glass-card">
              <span class="chip-dot success"></span>
              <div class="chip-text">
                <span class="chip-title">Recommended Next Step</span>
                <span class="chip-val">{{ currentTrack.nextStep }}</span>
              </div>
            </div>
          </div>

          <!-- Bottom Trust Metric -->
          <div class="brand-footer-metrics">
            <div class="f-metric">
              <span class="f-val">10,000+</span>
              <span class="f-lbl">Students Guided</span>
            </div>
            <div class="f-sep"></div>
            <div class="f-metric">
              <span class="f-val">100+</span>
              <span class="f-lbl">Career Pathways</span>
            </div>
            <div class="f-sep"></div>
            <div class="f-metric">
              <span class="f-val">94%</span>
              <span class="f-lbl">Accuracy Benchmark</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Authentication Card -->
      <div class="auth-form-pane">
        <div class="auth-card glass-card">
          <!-- Auth Header -->
          <div class="auth-header text-center">
            <div class="auth-logo">
              <app-icon name="sparkles" [size]="24"></app-icon>
            </div>
            <h2>Welcome Back</h2>
            <p class="auth-subtitle">Continue your journey toward becoming career-ready.</p>
          </div>

          <!-- Google Authentication Error Alert (if any) -->
          <div *ngIf="googleAuthError" class="auth-alert danger-alert" role="alert">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <p class="alert-title">Notice</p>
              <p class="alert-desc">{{ googleAuthError }}</p>
            </div>
            <button type="button" class="alert-close" (click)="googleAuthError = null">✕</button>
          </div>

          <!-- Google Identity Services Button -->
          <div class="google-btn-section" [class.is-busy]="googleLoading">
            <div #googleBtnContainer id="googleBtn" class="google-btn-container"></div>
          </div>

          <div class="auth-divider">
            <span>OR SIGN IN WITH EMAIL</span>
          </div>

          <!-- Email / Password Form -->
          <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form" novalidate>
            <!-- Email Field -->
            <div class="form-group">
              <label class="form-label" for="email">Student Email</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-control"
                [(ngModel)]="email"
                #emailInput="ngModel"
                required
                email
                placeholder="praveen.dev@college.edu"
                [class.is-invalid]="(emailInput.invalid && (emailInput.dirty || emailInput.touched || submitted)) || emailError"
              />
              <div class="form-error" *ngIf="emailError || (emailInput.invalid && (emailInput.dirty || emailInput.touched || submitted))">
                <span *ngIf="emailError">{{ emailError }}</span>
                <span *ngIf="!emailError && emailInput.errors?.['required']">Email address is required.</span>
                <span *ngIf="!emailError && emailInput.errors?.['email']">Please enter a valid email address.</span>
              </div>
            </div>

            <!-- Password Field -->
            <div class="form-group">
              <div class="password-label-row">
                <label class="form-label" for="password">Password</label>
                <button type="button" class="forgot-link" (click)="openForgotPassword()">Forgot Password?</button>
              </div>
              <div class="password-input-wrap">
                <input
                  [type]="showPassword ? 'text' : 'password'"
                  id="password"
                  name="password"
                  class="form-control"
                  [(ngModel)]="password"
                  #passwordInput="ngModel"
                  required
                  minlength="6"
                  placeholder="••••••••"
                  [class.is-invalid]="(passwordInput.invalid && (passwordInput.dirty || passwordInput.touched || submitted)) || passwordError"
                />
                <button type="button" class="pwd-toggle" (click)="showPassword = !showPassword" aria-label="Toggle password visibility">
                  {{ showPassword ? 'Hide' : 'Show' }}
                </button>
              </div>
              <div class="form-error" *ngIf="passwordError || (passwordInput.invalid && (passwordInput.dirty || passwordInput.touched || submitted))">
                <span *ngIf="passwordError">{{ passwordError }}</span>
                <span *ngIf="!passwordError && passwordInput.errors?.['required']">Password is required.</span>
                <span *ngIf="!passwordError && passwordInput.errors?.['minlength']">Password must be at least 6 characters.</span>
              </div>
            </div>

            <!-- Remember me checkbox -->
            <div class="remember-row">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" />
                <span>Remember me on this device</span>
              </label>
            </div>

            <!-- Submit Button with Simulated Loading State -->
            <button type="submit" class="btn btn-primary btn-lg submit-btn" [disabled]="loading || googleLoading">
              <span *ngIf="!loading">Login</span>
              <span *ngIf="loading" class="btn-spinner-wrap">
                <span class="btn-spinner"></span>
                <span>Signing you in...</span>
              </span>
            </button>
          </form>

          <div class="auth-divider">
            <span>OR</span>
          </div>

          <!-- Quick Demo Login Shortcut -->
          <button type="button" class="btn btn-secondary demo-btn" (click)="fillDemoCredentials()">
            ⚡ Quick Auto-Fill Demo (Praveen)
          </button>

          <!-- Create Account Link -->
          <div class="auth-footer text-center">
            <p>Don't have an account? <a routerLink="/register" class="register-link font-semibold">Create Account</a></p>
          </div>
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div class="modal-overlay" *ngIf="showForgotModal" (click)="closeForgotPassword()">
        <div class="modal-content glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Reset Password</h3>
            <button class="close-btn" (click)="closeForgotPassword()">✕</button>
          </div>
          <div class="modal-body" *ngIf="!forgotSubmitted">
            <p class="text-secondary text-sm" style="margin-bottom: 1rem;">
              Enter your student email and we will send you password reset instructions.
            </p>
            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" class="form-control" [(ngModel)]="resetEmail" placeholder="student@college.edu" />
            </div>
            <button class="btn btn-primary" style="width: 100%;" (click)="sendResetLink()">Send Reset Link</button>
          </div>
          <div class="modal-body text-center" *ngIf="forgotSubmitted">
            <app-icon name="check-circle" [size]="48" class="text-success" style="margin-bottom: 1rem;"></app-icon>
            <h4>Reset Link Sent!</h4>
            <p class="text-secondary text-sm">If an account exists for {{ resetEmail }}, a reset link has been dispatched.</p>
            <button class="btn btn-secondary btn-sm" style="margin-top: 1.25rem;" (click)="closeForgotPassword()">Done</button>
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

    /* Left Pane — Clean light indigo */
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
      box-shadow: 0 0 8px rgba(79,70,229,0.4);
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

    /* Abstract Visual Element */
    .ai-career-visual {
      position: relative;
      margin-bottom: 2.5rem;
      padding: 1.25rem 0;
    }
    .visual-ambient-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(50px);
      pointer-events: none;
    }
    .orb-1 {
      top: -20px;
      left: -20px;
      width: 140px;
      height: 140px;
      background: rgba(99, 102, 241, 0.25);
    }
    .orb-2 {
      bottom: -10px;
      right: 10px;
      width: 120px;
      height: 120px;
      background: rgba(6, 182, 212, 0.25);
    }
    .visual-track-tabs {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 0.85rem;
      flex-wrap: wrap;
    }
    .track-tab-btn {
      padding: 0.3rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .track-tab-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    .track-tab-btn.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 2px 8px rgba(79, 70, 229, 0.25);
    }
    .center-radar-card {
      padding: 1.25rem 1.5rem;
      border-radius: var(--radius-lg);
      background: #ffffff;
      border: 1px solid #e0e7ff;
      box-shadow: 0 4px 16px rgba(79,70,229,0.08);
      margin-bottom: 1rem;
    }
    .radar-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .radar-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-md);
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .radar-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
    }
    .radar-role {
      font-size: 0.95rem;
      font-weight: 700;
      color: #1e1b4b;
      margin: 0;
    }
    .mini-metrics-row {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
    }
    .mini-metric {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.8rem;
    }
    .metric-name {
      width: 80px;
      color: #4c5270;
      font-weight: 500;
    }
    .mini-bar-track {
      flex: 1;
      height: 6px;
      border-radius: 3px;
      background: #e0e7ff;
      overflow: hidden;
    }
    .mini-bar-fill {
      height: 100%;
      background: var(--gradient-primary);
      border-radius: 3px;
      transition: width 1s ease-in-out;
    }
    .mini-bar-fill.warning {
      background: var(--warning);
    }
    .mini-bar-fill.cyan {
      background: var(--accent-cyan);
    }
    .metric-val {
      font-weight: 600;
      color: var(--text-primary);
      width: 35px;
      text-align: right;
    }
    .metric-val.warning { color: var(--warning); }
    .metric-val.cyan { color: var(--accent-cyan); }

    /* Floating Micro Cards */
    .floating-chip {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 1rem;
      border-radius: var(--radius-md);
      background: #ffffff;
      border: 1px solid #e0e7ff;
      margin-bottom: 0.6rem;
      box-shadow: 0 2px 8px rgba(79,70,229,0.06);
      transition: transform var(--transition-fast);
    }
    .floating-chip:hover {
      transform: translateX(4px);
    }
    .chip-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .chip-dot.warning { background: var(--warning); box-shadow: 0 0 8px var(--warning); }
    .chip-dot.primary { background: var(--primary); box-shadow: 0 0 8px var(--primary); }
    .chip-dot.success { background: var(--success); box-shadow: 0 0 8px var(--success); }
    .chip-text {
      display: flex;
      flex-direction: column;
    }
    .chip-title {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .chip-val {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    /* Bottom Trust Metrics */
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

    /* Right Pane: Form Area */
    .auth-form-pane {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
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
    .auth-header h2 {
      font-size: 1.65rem;
      margin-bottom: 0.35rem;
    }
    .auth-subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }

    /* Google Button & Alerts */
    .google-btn-section {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 44px;
      width: 100%;
      margin-bottom: 0.5rem;
    }
    .google-btn-section.is-busy {
      opacity: 0.5;
      pointer-events: none;
    }
    .google-btn-container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .auth-alert {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.85rem 1rem;
      border-radius: var(--radius-md);
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
      line-height: 1.4;
    }
    .danger-alert {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
    }
    .alert-icon { font-size: 1.1rem; flex-shrink: 0; }
    .alert-content { flex: 1; }
    .alert-title { font-weight: 600; color: #f87171; margin-bottom: 0.2rem; }
    .alert-desc { font-size: 0.8rem; color: #fecaca; }
    .alert-close {
      background: none; border: none; color: #f87171; font-size: 1rem; cursor: pointer; opacity: 0.8;
    }

    .password-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .forgot-link {
      font-size: 0.785rem;
      color: var(--primary);
      background: none;
      border: none;
      cursor: pointer;
    }
    .forgot-link:hover { text-decoration: underline; }
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
    .remember-row {
      display: flex;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .submit-btn { width: 100%; }
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
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

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
    .demo-btn {
      width: 100%;
      margin-bottom: 1.5rem;
      font-size: 0.85rem;
    }
    .auth-footer {
      border-top: 1px solid var(--border-subtle);
      padding-top: 1.25rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .register-link { color: var(--primary); }
    .register-link:hover { text-decoration: underline; }
    .is-invalid { border-color: var(--danger) !important; }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .modal-body { padding: 1.5rem; }
    .close-btn { color: var(--text-muted); font-size: 1.2rem; }

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
      .ai-career-visual {
        display: none;
      }
      .auth-form-pane {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChild('googleBtnContainer', { static: false })
  public googleBtnContainer!: ElementRef<HTMLDivElement>;

  public tracks = [
    {
      tabLabel: '🐍 Python Full Stack',
      name: 'Python Full Stack Developer',
      badge: '85% Target',
      skills: [
        { name: 'Python', pct: 75, color: '' },
        { name: 'FastAPI', pct: 45, color: 'warning' },
        { name: 'Angular / React', pct: 60, color: 'cyan' }
      ],
      gap: 'Redis & Celery Tasks (30% → 75%)',
      readiness: '68% Job Ready',
      nextStep: 'Master FastAPI Async APIs (2 weeks)'
    },
    {
      tabLabel: '🎨 Frontend',
      name: 'Frontend Engineer',
      badge: '88% Target',
      skills: [
        { name: 'JavaScript / TS', pct: 80, color: '' },
        { name: 'Angular / React', pct: 65, color: 'cyan' },
        { name: 'State Management', pct: 40, color: 'warning' }
      ],
      gap: 'Reactive Signals & RxJS (40% → 80%)',
      readiness: '72% Job Ready',
      nextStep: 'Deep Dive into State Management (2 weeks)'
    },
    {
      tabLabel: '🤖 AI / ML',
      name: 'AI/ML Engineer',
      badge: '82% Target',
      skills: [
        { name: 'Python', pct: 80, color: '' },
        { name: 'PyTorch', pct: 40, color: 'warning' },
        { name: 'Vector DBs', pct: 35, color: 'cyan' }
      ],
      gap: 'Deep Learning Pipelines (35% → 80%)',
      readiness: '58% Job Ready',
      nextStep: 'Train Neural Networks with PyTorch (3 weeks)'
    },
    {
      tabLabel: '📊 Data Analyst',
      name: 'Data Analyst',
      badge: '90% Target',
      skills: [
        { name: 'SQL Queries', pct: 85, color: '' },
        { name: 'Power BI', pct: 45, color: 'warning' },
        { name: 'Pandas', pct: 60, color: 'cyan' }
      ],
      gap: 'Power BI Executive Dashboards (45% → 80%)',
      readiness: '65% Job Ready',
      nextStep: 'Build KPI Dashboards in Power BI (2 weeks)'
    }
  ];
  public selectedTrackIndex: number = 0;

  public get currentTrack() {
    return this.tracks[this.selectedTrackIndex];
  }

  public email: string = 'praveen.dev@college.edu';
  public password: string = 'CareerPass2026!';
  public rememberMe: boolean = true;
  public showPassword: boolean = false;
  public submitted: boolean = false;
  public loading: boolean = false;

  public emailError: string | null = null;
  public passwordError: string | null = null;

  // Google Authentication State
  public googleLoading: boolean = false;
  public googleAuthError: string | null = null;
  private googleInitialized: boolean = false;
  private gisPollTimer: any = null;

  public showForgotModal: boolean = false;
  public resetEmail: string = '';
  public forgotSubmitted: boolean = false;

  constructor(
    private router: Router,
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
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        width: 360
      });

      this.googleInitialized = true;
    } catch (err) {
      console.warn('GIS button render:', err);
    }
  }

  public handleGoogleCredentialResponse(response: any): void {
    this.ngZone.run(() => {
      if (!response || !response.credential) {
        this.googleAuthError = 'Google authentication was cancelled or returned no ID token.';
        return;
      }

      this.googleLoading = true;
      this.googleAuthError = null;

      // Simulated immediate frontend authentication
      setTimeout(() => {
        this.googleLoading = false;
        this.router.navigate(['/dashboard']);
      }, 600);
    });
  }

  /**
   * Simulated frontend login with validation
   */
  public onLogin(): void {
    this.submitted = true;
    this.emailError = null;
    this.passwordError = null;

    // Validate email
    if (!this.email || !this.email.trim()) {
      this.emailError = 'Please enter your email';
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email';
      return;
    }

    // Validate password
    if (!this.password || !this.password.trim()) {
      this.passwordError = 'Please enter your password';
      return;
    }
    if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }

    // Call real Spring Boot backend authentication
    this.loading = true;
    this.authService.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        const msg = err?.error?.message || err?.message || 'Invalid email or password';
        this.passwordError = msg;
      }
    });
  }

  public fillDemoCredentials(): void {
    this.email = 'praveen.dev@college.edu';
    this.password = 'CareerPass2026!';
    this.emailError = null;
    this.passwordError = null;
  }

  public openForgotPassword(): void {
    this.resetEmail = this.email;
    this.forgotSubmitted = false;
    this.showForgotModal = true;
  }

  public closeForgotPassword(): void {
    this.showForgotModal = false;
  }

  public sendResetLink(): void {
    if (this.resetEmail) {
      this.forgotSubmitted = true;
    }
  }
}
