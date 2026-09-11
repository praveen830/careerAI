import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { CareerService } from '../../../core/services/career.service';
import { ThemeService } from '../../../core/services/theme.service';
import { StudentProfile, CareerGoal } from '../../../core/models';

@Component({
  selector: 'app-settings',
  template: `
    <div class="settings-page">
      <section class="settings-header glass-card">
        <div>
          <span class="badge badge-primary">Preferences & System</span>
          <h1>Account & Application Settings</h1>
          <p class="text-secondary">Manage your student credentials, active career track, interface theme, and notification preferences.</p>
        </div>
      </section>

      <div class="settings-sections-list">
        <!-- Section 1: Account -->
        <section class="settings-card glass-card">
          <div class="section-title-wrap">
            <app-icon name="user" [size]="20" class="text-primary"></app-icon>
            <h3>Account Details</h3>
          </div>

          <div class="settings-form-grid grid-2">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="profile.fullName" (change)="saveAccount()" />
            </div>

            <div class="form-group">
              <label class="form-label">Student Email</label>
              <input type="email" class="form-control" [(ngModel)]="profile.email" (change)="saveAccount()" />
            </div>
          </div>
          <span class="text-xs text-muted" *ngIf="savedNotice">✓ Account changes saved locally.</span>
        </section>

        <!-- Section 2: Career -->
        <section class="settings-card glass-card">
          <div class="section-title-wrap">
            <app-icon name="target" [size]="20" class="text-cyan"></app-icon>
            <h3>Career Goal Configuration</h3>
          </div>

          <div class="form-group">
            <label class="form-label">Active Target Career Track</label>
            <select class="form-control" [(ngModel)]="profile.careerGoal" (change)="saveAccount()">
              <option *ngFor="let g of availableGoals" [value]="g.title">{{ g.title }}</option>
            </select>
            <span class="text-xs text-muted" style="margin-top: 0.35rem;">
              Changing this updates the Skill Gap comparison benchmarks and Recommended Roadmap topics.
            </span>
          </div>
        </section>

        <!-- Section 3: Preferences -->
        <section class="settings-card glass-card">
          <div class="section-title-wrap">
            <app-icon name="settings" [size]="20" class="text-warning"></app-icon>
            <h3>Interface & Notification Preferences</h3>
          </div>

          <div class="toggle-list">
            <!-- Theme Toggle -->
            <div class="toggle-item">
              <div>
                <span class="toggle-label font-semibold">Dark Theme Mode</span>
                <p class="text-xs text-muted">Switch between sleek dark tech aesthetic and crisp light mode</p>
              </div>
              <button
                type="button"
                class="switch-btn"
                [class.active]="themeService.isDark"
                (click)="themeService.toggleTheme()"
              >
                <span class="switch-knob"></span>
              </button>
            </div>

            <!-- Email Notifications -->
            <div class="toggle-item">
              <div>
                <span class="toggle-label font-semibold">Daily Study Streak Reminders</span>
                <p class="text-xs text-muted">Receive nudge notifications to maintain your 7-day study streak</p>
              </div>
              <button
                type="button"
                class="switch-btn"
                [class.active]="streakNotifications"
                (click)="streakNotifications = !streakNotifications"
              >
                <span class="switch-knob"></span>
              </button>
            </div>

            <!-- Weekly Gap Reports -->
            <div class="toggle-item">
              <div>
                <span class="toggle-label font-semibold">Weekly Skill Gap Diagnostics Digest</span>
                <p class="text-xs text-muted">Weekly summaries highlighting closed skill gaps and roadmap progress</p>
              </div>
              <button
                type="button"
                class="switch-btn"
                [class.active]="weeklyReports"
                (click)="weeklyReports = !weeklyReports"
              >
                <span class="switch-knob"></span>
              </button>
            </div>
          </div>
        </section>

        <!-- Section 4: Security -->
        <section class="settings-card glass-card">
          <div class="section-title-wrap">
            <app-icon name="sparkles" [size]="20" class="text-danger"></app-icon>
            <h3>Security & Session</h3>
          </div>

          <div class="security-actions-row">
            <div class="change-password-box">
              <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">Change Password</h4>
              <p class="text-xs text-muted" style="margin-bottom: 0.75rem;">Update your student portal password</p>
              <div class="pwd-inline-form">
                <input type="password" class="form-control input-sm" placeholder="New password (min 6 chars)" [(ngModel)]="newPassword" />
                <button class="btn btn-secondary btn-sm" (click)="changePassword()">Update Password</button>
              </div>
              <span class="text-xs text-success" *ngIf="passwordChangedNotice" style="display: block; margin-top: 0.5rem;">
                ✓ Password updated successfully!
              </span>
            </div>

            <div class="logout-box">
              <h4 style="font-size: 1rem; margin-bottom: 0.25rem;">Student Sign Out</h4>
              <p class="text-xs text-muted" style="margin-bottom: 0.75rem;">Log out of your session on this browser</p>
              <button class="btn btn-danger btn-sm" (click)="onLogout()">
                <app-icon name="log-out" [size]="16"></app-icon>
                <span>Log Out of CareerAI</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1000px;
      margin: 0 auto;
    }
    .settings-header {
      padding: 2rem 2.5rem;
    }
    .settings-header h1 {
      font-size: 1.85rem;
      margin: 0.5rem 0 0.35rem;
    }
    .settings-sections-list {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .settings-card {
      padding: 2rem 2.25rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .section-title-wrap {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.75rem;
    }
    .section-title-wrap h3 {
      font-size: 1.2rem;
    }
    .toggle-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .toggle-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .switch-btn {
      width: 48px;
      height: 26px;
      border-radius: var(--radius-full);
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-color);
      position: relative;
      cursor: pointer;
      transition: background var(--transition-fast);
      flex-shrink: 0;
    }
    .switch-btn.active {
      background: var(--primary);
      border-color: var(--primary);
    }
    .switch-knob {
      position: absolute;
      left: 3px;
      top: 3px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #ffffff;
      transition: transform var(--transition-fast);
    }
    .switch-btn.active .switch-knob {
      transform: translateX(22px);
    }

    .security-actions-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    .pwd-inline-form {
      display: flex;
      gap: 0.5rem;
    }

    @media (max-width: 768px) {
      .security-actions-row { grid-template-columns: 1fr; }
      .settings-card { padding: 1.5rem; }
    }
  `]
})
export class SettingsComponent implements OnInit {
  public profile!: StudentProfile;
  public availableGoals: CareerGoal[] = [];
  public streakNotifications: boolean = true;
  public weeklyReports: boolean = true;
  public newPassword: string = '';
  public savedNotice: boolean = false;
  public passwordChangedNotice: boolean = false;

  constructor(
    private studentService: StudentService,
    private careerService: CareerService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profile = { ...this.studentService.currentProfile };
    this.careerService.getCareerGoals().subscribe(g => this.availableGoals = g);
  }

  public saveAccount(): void {
    this.studentService.updateProfile(this.profile);
    this.savedNotice = true;
    setTimeout(() => this.savedNotice = false, 2500);
  }

  public changePassword(): void {
    if (this.newPassword.length >= 6) {
      this.passwordChangedNotice = true;
      this.newPassword = '';
      setTimeout(() => this.passwordChangedNotice = false, 3000);
    }
  }

  public onLogout(): void {
    this.router.navigate(['/login']);
  }
}
