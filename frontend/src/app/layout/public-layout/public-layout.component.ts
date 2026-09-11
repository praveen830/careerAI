import { Component } from '@angular/core';

@Component({
  selector: 'app-public-layout',
  template: `
    <div class="public-wrapper">
      <!-- Sticky Navigation -->
      <header class="public-header">
        <div class="container header-container">
          <a routerLink="/" class="brand-logo">
            <div class="logo-badge">
              <app-icon name="sparkles" [size]="20"></app-icon>
            </div>
            <span class="logo-text">Career<span class="text-gradient">AI</span></span>
          </a>

          <nav class="public-nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/features" routerLinkActive="active">Features</a>
            <a routerLink="/about" routerLinkActive="active">About</a>
          </nav>

          <div class="header-actions">
            <a routerLink="/login" class="btn btn-ghost btn-sm">Log in</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
          </div>
        </div>
      </header>

      <!-- Main Routed Content -->
      <main class="public-main">
        <router-outlet></router-outlet>
      </main>

      <!-- Modern Footer -->
      <footer class="public-footer">
        <div class="container footer-container">
          <div class="footer-brand">
            <div class="brand-logo">
              <div class="logo-badge">
                <app-icon name="sparkles" [size]="18"></app-icon>
              </div>
              <span class="logo-text">Career<span class="text-gradient">AI</span></span>
            </div>
            <p class="footer-desc">
              AI-Powered Student Career & Skill Gap Analyzer. Helping aspiring engineers analyze gaps, build in-demand skills, and become job-ready faster.
            </p>
            <div class="footer-badge">
              <span class="badge badge-primary">Version 1.0 • Student Frontend</span>
            </div>
          </div>

          <div class="footer-links-group">
            <div class="footer-col">
              <h4>Platform</h4>
              <a routerLink="/features">Features Overview</a>
              <a routerLink="/skill-gap">Skill Gap Analysis</a>
              <a routerLink="/roadmap">Career Roadmaps</a>
              <a routerLink="/projects">Portfolio Projects</a>
              <a routerLink="/resume">Resume Analyzer</a>
            </div>

            <div class="footer-col">
              <h4>Career Tracks</h4>
              <a routerLink="/onboarding/career-goal">Java Full Stack</a>
              <a routerLink="/onboarding/career-goal">Python Full Stack</a>
              <a routerLink="/onboarding/career-goal">Frontend Developer</a>
              <a routerLink="/onboarding/career-goal">Data Scientist</a>
              <a routerLink="/onboarding/career-goal">DevOps Engineer</a>
            </div>

            <div class="footer-col">
              <h4>Company</h4>
              <a routerLink="/about">About Us</a>
              <a routerLink="/about">Methodology</a>
              <a routerLink="/login">Student Sign In</a>
              <a routerLink="/register">Register Now</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom container">
          <p>© 2026 CareerAI Platform. Designed for modern engineering students. All rights reserved.</p>
          <div class="footer-bottom-links">
            <a routerLink="/about">Privacy Policy</a>
            <a routerLink="/about">Terms of Service</a>
            <a routerLink="/about">Help & Support</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .public-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-app);
      position: relative;
    }
    .public-header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      height: 72px;
      display: flex;
      align-items: center;
    }
    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-weight: 800;
      font-size: 1.35rem;
      color: var(--text-primary);
    }
    .logo-badge {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.4);
    }
    .public-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .public-nav a {
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.95rem;
      transition: color var(--transition-fast);
    }
    .public-nav a:hover,
    .public-nav a.active {
      color: var(--primary);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .public-main {
      flex: 1;
    }
    .public-footer {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-color);
      padding: 4.5rem 0 2rem;
      margin-top: 4rem;
    }
    .footer-container {
      display: flex;
      gap: 4rem;
      margin-bottom: 3.5rem;
    }
    .footer-brand {
      max-width: 360px;
    }
    .footer-desc {
      color: var(--text-secondary);
      margin: 1rem 0 1.25rem;
      font-size: 0.925rem;
      line-height: 1.6;
    }
    .footer-links-group {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    .footer-col h4 {
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
    }
    .footer-col a {
      display: block;
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
      transition: color var(--transition-fast);
    }
    .footer-col a:hover {
      color: var(--primary);
    }
    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--border-subtle);
      padding-top: 1.75rem;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .footer-bottom-links {
      display: flex;
      gap: 1.5rem;
    }
    .footer-bottom-links a:hover {
      color: var(--primary);
    }

    @media (max-width: 860px) {
      .footer-container {
        flex-direction: column;
        gap: 2.5rem;
      }
      .footer-links-group {
        grid-template-columns: repeat(2, 1fr);
      }
      .footer-bottom {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
      .public-nav {
        display: none;
      }
    }
  `]
})
export class PublicLayoutComponent {}
