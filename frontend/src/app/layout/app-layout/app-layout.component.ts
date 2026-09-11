import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StudentService } from '../../core/services/student.service';
import { ThemeService } from '../../core/services/theme.service';
import { StudentProfile } from '../../core/models';

@Component({
  selector: 'app-app-layout',
  template: `
    <div class="app-layout" [class.mobile-menu-open]="isMobileMenuOpen">
      <!-- Desktop Sidebar & Mobile Off-canvas Drawer -->
      <aside class="app-sidebar" [class.open]="isMobileMenuOpen">
        <div class="sidebar-header">
          <a routerLink="/dashboard" class="sidebar-brand" (click)="closeMobileMenu()">
            <div class="brand-badge">
              <app-icon name="sparkles" [size]="20"></app-icon>
            </div>
            <span class="brand-title">Career<span class="text-gradient">AI</span></span>
          </a>
          <button class="mobile-close-btn" (click)="closeMobileMenu()" aria-label="Close menu">
            ✕
          </button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-label">CAREER INTELLIGENCE</div>
          <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="layout-dashboard" [size]="18"></app-icon>
            <span>Dashboard</span>
          </a>
          <a routerLink="/profile" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="user" [size]="18"></app-icon>
            <span>My Profile</span>
          </a>
          <a routerLink="/onboarding/skills" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="code" [size]="18"></app-icon>
            <span>My Skills</span>
          </a>
          <a routerLink="/onboarding/career-goal" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="target" [size]="18"></app-icon>
            <span>Career Goal</span>
          </a>
          <a routerLink="/skill-gap" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="bar-chart-2" [size]="18"></app-icon>
            <span>Skill Gap</span>
            <span class="nav-pill badge-danger">Gaps</span>
          </a>
          <a routerLink="/roadmap" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="compass" [size]="18"></app-icon>
            <span>Roadmap</span>
          </a>
          <a routerLink="/projects" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="folder-git" [size]="18"></app-icon>
            <span>Projects</span>
          </a>
          <a routerLink="/resume" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="file-text" [size]="18"></app-icon>
            <span>Resume</span>
          </a>
          <a routerLink="/job-analyzer" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="search" [size]="18"></app-icon>
            <span>Job Analyzer</span>
          </a>
          <a routerLink="/progress" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="trending-up" [size]="18"></app-icon>
            <span>Progress</span>
          </a>
          <a routerLink="/ai-assistant" routerLinkActive="active" (click)="closeMobileMenu()">
            <app-icon name="sparkles" [size]="18"></app-icon>
            <span>AI Assistant</span>
            <span class="nav-pill badge-primary">AI</span>
          </a>
        </nav>

        <!-- Bottom Actions: Settings & Logout -->
        <div class="sidebar-bottom-actions">
          <a routerLink="/settings" routerLinkActive="active" class="sidebar-action-link" (click)="closeMobileMenu()">
            <app-icon name="settings" [size]="18"></app-icon>
            <span>Settings</span>
          </a>
          <button type="button" class="sidebar-action-link logout-action" (click)="onLogout()">
            <app-icon name="log-out" [size]="18"></app-icon>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- Backdrop for mobile drawer -->
      <div class="drawer-backdrop" *ngIf="isMobileMenuOpen" (click)="closeMobileMenu()"></div>

      <!-- Main Shell Area -->
      <div class="app-main-area">
        <!-- Topbar -->
        <header class="app-topbar">
          <div class="topbar-left">
            <button class="menu-toggle-btn" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div class="page-title-box">
              <h2 class="current-title">{{ currentRouteTitle }}</h2>
            </div>
          </div>

          <div class="topbar-right">
            <!-- Learning Streak -->
            <div class="streak-badge" title="7 Consecutive Days of Career Prep">
              <app-icon name="flame" [size]="16"></app-icon>
              <span>{{ profile.streakDays }} days 🔥</span>
            </div>

            <!-- Dark / Light Theme Toggle -->
            <button class="icon-btn theme-toggle" (click)="themeService.toggleTheme()" [title]="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
              <app-icon [name]="isDark ? 'sun' : 'moon'" [size]="18"></app-icon>
            </button>

            <!-- Notifications Mock -->
            <button class="icon-btn notification-btn" (click)="toggleNotifications()" title="Notifications">
              <app-icon name="bell" [size]="18"></app-icon>
              <span class="notification-dot"></span>
            </button>

            <!-- Notification Dropdown Popover -->
            <div class="notification-dropdown glass-card" *ngIf="showNotifications">
              <div class="dropdown-header">
                <h4>Notifications</h4>
                <span class="badge badge-primary">2 new</span>
              </div>
              <div class="dropdown-list">
                <div class="notif-item">
                  <span class="notif-icon">💡</span>
                  <div class="notif-content">
                    <p class="notif-text">Spring Security recommended to close your 40% gap.</p>
                    <span class="notif-time">2 hours ago</span>
                  </div>
                </div>
                <div class="notif-item">
                  <span class="notif-icon">🔥</span>
                  <div class="notif-content">
                    <p class="notif-text">You reached a 7-day study streak!</p>
                    <span class="notif-time">Today</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Profile Avatar & User Dropdown -->
            <div class="topbar-profile-wrap" (click)="toggleUserDropdown()">
              <div class="topbar-avatar">
                <div class="avatar-ring">
                  <span>{{ profile.fullName.charAt(0) }}</span>
                </div>
              </div>
              <div class="topbar-user-meta">
                <span class="topbar-user-name">{{ profile.fullName }}</span>
                <span class="topbar-user-role">{{ profile.careerGoal }}</span>
              </div>
              <span class="topbar-chevron">▾</span>

              <!-- User Profile Dropdown Menu -->
              <div class="user-menu-dropdown glass-card" *ngIf="showUserDropdown" (click)="$event.stopPropagation()">
                <div class="user-menu-header">
                  <p class="menu-name">{{ profile.fullName }}</p>
                  <p class="menu-email">{{ profile.email }}</p>
                  <span class="badge badge-primary" style="margin-top: 4px;">{{ profile.careerGoal }}</span>
                </div>
                <div class="user-menu-links">
                  <a routerLink="/profile" (click)="showUserDropdown = false">
                    <app-icon name="user" [size]="16"></app-icon>
                    <span>My Profile</span>
                  </a>
                  <a routerLink="/settings" (click)="showUserDropdown = false">
                    <app-icon name="settings" [size]="16"></app-icon>
                    <span>Settings</span>
                  </a>
                  <div class="menu-divider"></div>
                  <button type="button" class="menu-logout-btn" (click)="onLogout()">
                    <app-icon name="log-out" [size]="16"></app-icon>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        <!-- Routed Content Body -->
        <main class="app-content-body">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      min-height: 100vh;
      background: var(--bg-app);
      position: relative;
    }

    /* Sidebar Styles */
    .app-sidebar {
      width: 270px;
      background: var(--bg-surface);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 100;
      transition: transform var(--transition-normal);
    }
    .sidebar-header {
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 800;
      font-size: 1.25rem;
      color: var(--text-primary);
    }
    .brand-badge {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }
    .mobile-close-btn {
      display: none;
      color: var(--text-secondary);
      font-size: 1.2rem;
    }
    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .nav-section-label {
      font-size: 0.6875rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.08em;
      padding: 0.85rem 0.75rem 0.35rem;
    }
    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.65rem 0.85rem;
      color: var(--text-secondary);
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      position: relative;
    }
    .sidebar-nav a:hover {
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
    }
    .sidebar-nav a.active {
      background: var(--primary-light);
      color: var(--primary);
      font-weight: 600;
    }
    .sidebar-nav a.active::before {
      content: '';
      position: absolute;
      left: -0.85rem;
      top: 20%;
      bottom: 20%;
      width: 4px;
      border-radius: 0 4px 4px 0;
      background: var(--primary);
    }
    .nav-pill {
      margin-left: auto;
      font-size: 0.6875rem;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
      font-weight: 700;
    }

    /* Sidebar Footer */
    .sidebar-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--bg-surface);
    }
    .user-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      overflow: hidden;
    }
    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      font-size: 1rem;
      flex-shrink: 0;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .user-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .user-role {
      font-size: 0.75rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .logout-btn {
      color: var(--text-muted);
      padding: 0.4rem;
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
    }
    .logout-btn:hover {
      color: var(--danger);
      background: var(--danger-light);
    }

    /* Topbar Styles */
    .app-main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .app-topbar {
      height: 72px;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 90;
      backdrop-filter: blur(12px);
    }
    .topbar-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }
    .menu-toggle-btn {
      display: none;
      color: var(--text-primary);
      padding: 0.25rem;
    }
    .page-context {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .current-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
    }
    .topbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }
    .streak-badge {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
      border: 1px solid rgba(245, 158, 11, 0.25);
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 700;
    }
    .icon-btn {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      background: var(--bg-surface-elevated);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border-color);
      transition: all var(--transition-fast);
      position: relative;
    }
    .icon-btn:hover {
      color: var(--primary);
      border-color: var(--primary);
    }
    .notification-dot {
      position: absolute;
      top: 8px;
      right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--danger);
      box-shadow: 0 0 6px var(--danger);
    }
    .notification-dropdown {
      position: absolute;
      top: 50px;
      right: 40px;
      width: 320px;
      background: var(--bg-surface);
      padding: 1rem;
      z-index: 200;
    }
    .dropdown-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .notif-item {
      display: flex;
      gap: 0.75rem;
      padding: 0.65rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .notif-item:last-child {
      border-bottom: none;
    }
    .notif-text {
      font-size: 0.825rem;
      color: var(--text-primary);
      line-height: 1.4;
    }
    .notif-time {
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .avatar-ring {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 700;
      border: 2px solid var(--border-color);
      transition: transform var(--transition-fast);
    }
    .avatar-ring:hover {
      transform: scale(1.05);
    }

    /* Topbar Profile & Dropdown */
    .topbar-profile-wrap {
      position: relative;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.35rem 0.65rem;
      border-radius: var(--radius-md);
      cursor: pointer;
      user-select: none;
      transition: background var(--transition-fast);
    }
    .topbar-profile-wrap:hover {
      background: var(--bg-surface-elevated);
    }
    .topbar-user-meta {
      display: flex;
      flex-direction: column;
      text-align: left;
    }
    .topbar-user-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }
    .topbar-user-role {
      font-size: 0.72rem;
      color: var(--text-muted);
      line-height: 1.2;
    }
    .topbar-chevron {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .user-menu-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 230px;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: 110;
      padding: 0.5rem 0;
      animation: fadeIn 0.15s ease-out;
    }
    .user-menu-header {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .menu-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
    }
    .menu-email {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .user-menu-links {
      padding: 0.35rem 0;
    }
    .user-menu-links a, .menu-logout-btn {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      width: 100%;
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      transition: all var(--transition-fast);
    }
    .user-menu-links a:hover, .menu-logout-btn:hover {
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
    }
    .menu-divider {
      height: 1px;
      background: var(--border-subtle);
      margin: 0.35rem 0;
    }
    .menu-logout-btn {
      color: var(--danger);
    }

    /* Sidebar Bottom Actions */
    .sidebar-bottom-actions {
      border-top: 1px solid var(--border-subtle);
      padding: 1rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .sidebar-action-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-md);
      font-size: 0.88rem;
      color: var(--text-secondary);
      background: none;
      border: none;
      cursor: pointer;
      width: 100%;
      text-align: left;
      transition: all var(--transition-fast);
    }
    .sidebar-action-link:hover, .sidebar-action-link.active {
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
    }
    .logout-action:hover {
      color: var(--danger);
    }

    /* Body */
    .app-content-body {
      flex: 1;
      padding: 2rem;
      overflow-x: hidden;
    }

    /* Mobile Responsive styles */
    @media (max-width: 960px) {
      .topbar-user-meta {
        display: none;
      }
      .app-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        transform: translateX(-100%);
      }
      .app-sidebar.open {
        transform: translateX(0);
        box-shadow: var(--shadow-lg);
      }
      .mobile-close-btn {
        display: block;
      }
      .menu-toggle-btn {
        display: block;
      }
      .drawer-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        backdrop-filter: blur(4px);
        z-index: 95;
      }
      .app-topbar {
        padding: 0 1rem;
      }
      .app-content-body {
        padding: 1.25rem;
      }
    }
  `]
})
export class AppLayoutComponent implements OnInit, OnDestroy {
  public profile!: StudentProfile;
  public isDark: boolean = true;
  public isMobileMenuOpen: boolean = false;
  public showNotifications: boolean = false;
  public showUserDropdown: boolean = false;
  public currentRouteTitle: string = 'Dashboard';
  private sub = new Subscription();

  constructor(
    private studentService: StudentService,
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.studentService.profile$.subscribe(p => this.profile = p)
    );
    this.sub.add(
      this.themeService.isDark$.subscribe(d => this.isDark = d)
    );
    this.sub.add(
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {
        this.updateTitle(event.urlAfterRedirects || event.url);
      })
    );
    this.updateTitle(this.router.url);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  public toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) this.showUserDropdown = false;
  }

  public toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
    if (this.showUserDropdown) this.showNotifications = false;
  }

  public onLogout(): void {
    this.showUserDropdown = false;
    this.router.navigate(['/login']);
  }

  private updateTitle(url: string): void {
    if (url.includes('/dashboard')) this.currentRouteTitle = 'Dashboard';
    else if (url.includes('/skill-gap')) this.currentRouteTitle = 'Skill Gap';
    else if (url.includes('/roadmap')) this.currentRouteTitle = 'Roadmap';
    else if (url.includes('/projects')) this.currentRouteTitle = 'Projects';
    else if (url.includes('/resume')) this.currentRouteTitle = 'Resume';
    else if (url.includes('/job-analyzer')) this.currentRouteTitle = 'Job Analyzer';
    else if (url.includes('/progress')) this.currentRouteTitle = 'Progress';
    else if (url.includes('/ai-assistant')) this.currentRouteTitle = 'AI Assistant';
    else if (url.includes('/skills')) this.currentRouteTitle = 'My Skills';
    else if (url.includes('/career-goal')) this.currentRouteTitle = 'Career Goal';
    else if (url.includes('/profile')) this.currentRouteTitle = 'My Profile';
    else if (url.includes('/settings')) this.currentRouteTitle = 'Settings';
    else this.currentRouteTitle = 'Dashboard';
  }
}
