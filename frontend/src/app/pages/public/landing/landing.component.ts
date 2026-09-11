import { Component, HostListener, OnInit } from '@angular/core';

interface ChatPreviewExchange {
  student: string;
  ai: string;
}

@Component({
  selector: 'app-landing',
  template: `
    <div class="landing-wrapper">
      <!-- Ambient Glow Orbs -->
      <div class="glow-orb hero-orb-left"></div>
      <div class="glow-orb hero-orb-right"></div>
      <div class="glow-orb mid-orb"></div>

      <!-- ==========================================================================
           2. STICKY NAVBAR
           ========================================================================== -->
      <header class="landing-navbar" [class.scrolled]="isScrolled">
        <div class="container navbar-container">
          <!-- Logo with Career + AI + Growth mark -->
          <a routerLink="/" class="navbar-brand">
            <div class="logo-symbol">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <!-- AI sparkle + Career ladder node -->
                <path d="M12 2L14.4 8.6L21 11L14.4 13.4L12 20L9.6 13.4L3 11L9.6 8.6L12 2Z" fill="url(#logoGrad)" />
                <path d="M19 16L20 18.5L22.5 19.5L20 20.5L19 23L18 20.5L15.5 19.5L18 18.5L19 16Z" fill="#06b6d4" />
                <circle cx="5" cy="19" r="2.5" fill="#10b981" />
                <path d="M5 19L12 12" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-dasharray="2 2" />
                <defs>
                  <linearGradient id="logoGrad" x1="3" y1="2" x2="21" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#6366f1" />
                    <stop offset="1" stop-color="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span class="brand-name">Career<span class="text-gradient">AI</span></span>
          </a>

          <!-- Desktop Navigation Links -->
          <nav class="desktop-nav">
            <a (click)="scrollTo('hero')" class="nav-link">Home</a>
            <a (click)="scrollTo('how-it-works')" class="nav-link">How It Works</a>
            <a (click)="scrollTo('features')" class="nav-link">Features</a>
            <a (click)="scrollTo('skill-gap')" class="nav-link">Skill Gap</a>
            <a (click)="scrollTo('roadmap')" class="nav-link">Roadmap</a>
            <a routerLink="/about" class="nav-link">About</a>
          </nav>

          <!-- Right Action Buttons -->
          <div class="navbar-actions">
            <a routerLink="/login" class="btn btn-ghost btn-sm">Login</a>
            <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>

            <!-- Mobile Hamburger Toggle -->
            <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Mobile Drawer -->
        <div class="mobile-drawer" *ngIf="isMobileMenuOpen">
          <div class="mobile-nav-links">
            <a (click)="scrollTo('hero'); closeMobileMenu()" class="mobile-nav-link">Home</a>
            <a (click)="scrollTo('how-it-works'); closeMobileMenu()" class="mobile-nav-link">How It Works</a>
            <a (click)="scrollTo('features'); closeMobileMenu()" class="mobile-nav-link">Features</a>
            <a (click)="scrollTo('skill-gap'); closeMobileMenu()" class="mobile-nav-link">Skill Gap</a>
            <a (click)="scrollTo('roadmap'); closeMobileMenu()" class="mobile-nav-link">Roadmap</a>
            <a routerLink="/about" (click)="closeMobileMenu()" class="mobile-nav-link">About</a>
          </div>
          <div class="mobile-drawer-actions">
            <a routerLink="/login" class="btn btn-secondary btn-sm" style="width: 100%;">Login</a>
            <a routerLink="/register" class="btn btn-primary btn-sm" style="width: 100%;">Get Started</a>
          </div>
        </div>
      </header>

      <!-- Backdrop for mobile drawer -->
      <div class="mobile-backdrop" *ngIf="isMobileMenuOpen" (click)="closeMobileMenu()"></div>

      <!-- ==========================================================================
           3, 4, 5. HERO SECTION & FLOATING INTERACTIVE DASHBOARD VISUAL
           ========================================================================== -->
      <section class="hero-section" id="hero">
        <div class="container hero-container">
          <!-- LEFT SIDE: Value proposition & CTAs -->
          <div class="hero-content">
            <div class="hero-badge-pill">
              <span class="badge-sparkle">✦</span>
              <span>AI-Powered Career Intelligence</span>
            </div>

            <h1 class="hero-title">
              Build Your Career With
              <span class="text-gradient">Data-Driven Guidance</span>
            </h1>

            <p class="hero-subtitle">
              Discover your skill gaps. Understand your career readiness. Get a personalized roadmap to become job-ready.
            </p>

            <div class="hero-cta-row">
              <a routerLink="/register" class="btn btn-primary btn-lg hero-cta-btn">
                <span>Get Started</span>
                <span class="arrow-glyph">→</span>
              </a>
              <button (click)="scrollTo('features')" class="btn btn-secondary btn-lg">
                Explore Features
              </button>
            </div>

            <div class="hero-trust-tag">
              <span class="dot-separator">•</span>
              <span>No complicated setup</span>
              <span class="dot-separator">•</span>
              <span>Built for students</span>
              <span class="dot-separator">•</span>
              <span>Career-focused</span>
            </div>
          </div>

          <!-- RIGHT SIDE: Floating interactive dashboard visual -->
          <div class="hero-visual-wrapper">
            <div class="visual-glow-ring"></div>

            <!-- Floating Card 1: Biggest Skill Gap (Top Right) -->
            <div class="floating-chip gap-chip float-anim-1 glass-card">
              <div class="chip-top">
                <span class="chip-icon text-danger">⚡</span>
                <span class="chip-tag text-danger font-semibold text-xs">Biggest Skill Gap</span>
              </div>
              <div class="chip-body">
                <span class="chip-title font-bold">{{ activeTrack.skills[1].name }}</span>
                <span class="chip-delta text-danger font-semibold">{{ activeTrack.skills[1].pct }}% → {{ activeTrack.skills[1].target }}%</span>
              </div>
              <div class="chip-status-pill badge badge-danger">Needs Improvement</div>
            </div>

            <!-- Floating Card 2: Your Next Step (Bottom Left) -->
            <div class="floating-chip step-chip float-anim-2 glass-card">
              <div class="chip-top">
                <span class="chip-icon text-cyan">🗺️</span>
                <span class="chip-tag text-cyan font-semibold text-xs">Your Next Step</span>
              </div>
              <div class="chip-body">
                <span class="chip-title font-bold">{{ activeTrack.nextStepTitle }}</span>
                <span class="chip-delta text-muted text-xs">{{ activeTrack.nextStepTime }}</span>
              </div>
              <div class="chip-status-pill badge badge-cyan">Roadmap Milestone</div>
            </div>

            <!-- Interactive Role Showcase Selector -->
            <div class="hero-track-switcher">
              <button
                *ngFor="let t of showcaseTracks; let i = index"
                type="button"
                class="hero-track-pill"
                [class.active]="selectedShowcaseIndex === i"
                (click)="onSelectTrack(i)"
              >
                {{ t.label }}
              </button>
            </div>

            <!-- Main Interactive Dashboard Container -->
            <div class="hero-dashboard-card glass-card">
              <!-- Header -->
              <div class="dash-card-header">
                <div class="dash-role-info">
                  <span class="text-xs text-muted font-semibold uppercase tracking-wider">TARGET CAREER ROLE</span>
                  <h3 class="dash-role-title">{{ activeTrack.name }}</h3>
                </div>
                <span class="badge badge-success pulse-badge">● Live Benchmark</span>
              </div>

              <!-- Center: Circular Readiness Ring -->
              <div class="readiness-gauge-center">
                <app-circular-progress
                  [value]="activeTrack.readiness"
                  [size]="130"
                  [strokeWidth]="10"
                  label="Readiness"
                  colorClass="primary"
                ></app-circular-progress>
                <div class="readiness-caption">
                  <span class="caption-metric text-gradient font-bold">{{ activeTrack.readiness }}% Career Readiness</span>
                  <span class="text-xs text-secondary">Target: 80%+ to unlock placement referrals</span>
                </div>
              </div>

              <!-- Skill Cards Grid -->
              <div class="hero-skills-grid">
                <div
                  class="skill-mini-card glass-card"
                  *ngFor="let s of activeTrack.skills"
                  [class.alert-card]="s.gap >= 30"
                  (mouseenter)="hoveredSkill = s.name"
                  (mouseleave)="hoveredSkill = null"
                >
                  <div class="skill-mini-row">
                    <span class="skill-mini-name font-semibold">{{ s.name }}</span>
                    <span class="skill-mini-pct font-bold" [ngClass]="'text-' + s.color">{{ s.pct }}%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill" [ngClass]="'progress-bar-' + s.color" [style.width.%]="s.pct"></div>
                  </div>
                  <div class="skill-mini-tooltip" *ngIf="hoveredSkill === s.name">
                    <span class="text-xs" [ngClass]="s.gap >= 30 ? 'text-danger' : ''">
                      {{ s.level }} • Target: {{ s.target }}% {{ s.gap >= 30 ? '• Gap: ' + s.gap + '%' : '' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           6. TRUST / VALUE STRIP
           ========================================================================== -->
      <section class="trust-strip-section">
        <div class="container">
          <div class="trust-strip-card glass-card">
            <span class="trust-title text-xs font-bold text-muted uppercase">
              Everything you need to become career-ready:
            </span>

            <div class="trust-pillars-row">
              <div class="pillar-item">
                <span class="pillar-icon">🎯</span>
                <span class="pillar-text font-semibold">Clear Career Direction</span>
              </div>

              <div class="pillar-divider"></div>

              <div class="pillar-item">
                <span class="pillar-icon">📊</span>
                <span class="pillar-text font-semibold">Data-Driven Insights</span>
              </div>

              <div class="pillar-divider"></div>

              <div class="pillar-item">
                <span class="pillar-icon">🗺️</span>
                <span class="pillar-text font-semibold">Personalized Learning</span>
              </div>

              <div class="pillar-divider"></div>

              <div class="pillar-item">
                <span class="pillar-icon">💼</span>
                <span class="pillar-text font-semibold">Job Preparation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           7. HOW IT WORKS (5 STEPS TIMELINE)
           ========================================================================== -->
      <section class="how-it-works-section" id="how-it-works">
        <div class="container">
          <div class="section-intro text-center">
            <span class="badge badge-primary">Step-by-Step Blueprint</span>
            <h2 class="section-heading-lg">From Student to Job-Ready</h2>
            <p class="section-subtitle">
              A simple journey from understanding your skills to building your career.
            </p>
          </div>

          <div class="timeline-container">
            <div class="timeline-track-line"></div>

            <div class="timeline-steps-grid">
              <!-- Step 01 -->
              <div class="step-card glass-card glass-card-interactive">
                <div class="step-badge-circle">01</div>
                <h3 class="step-title">Create Your Profile</h3>
                <p class="step-desc">Tell us about yourself, your education and your interests.</p>
                <div class="step-subtext text-xs text-muted">College, Degree & Links</div>
              </div>

              <!-- Step 02 -->
              <div class="step-card glass-card glass-card-interactive">
                <div class="step-badge-circle">02</div>
                <h3 class="step-title">Add Your Skills</h3>
                <p class="step-desc">Tell us what you already know across languages, frameworks, and databases.</p>
                <div class="step-subtext text-xs text-muted">Self-Assessed Proficiencies</div>
              </div>

              <!-- Step 03 -->
              <div class="step-card glass-card glass-card-interactive">
                <div class="step-badge-circle">03</div>
                <h3 class="step-title">Choose Your Career</h3>
                <p class="step-desc">Select the role you want to achieve from 10 industry tracks.</p>
                <div class="step-subtext text-xs text-muted">Java Full Stack, Cloud, AI...</div>
              </div>

              <!-- Step 04 -->
              <div class="step-card glass-card glass-card-interactive">
                <div class="step-badge-circle">04</div>
                <h3 class="step-title">Discover Your Gaps</h3>
                <p class="step-desc">Understand which skills you need to improve with instant delta percentages.</p>
                <div class="step-subtext text-xs text-muted">Critical Gaps vs Strong Foundations</div>
              </div>

              <!-- Step 05 -->
              <div class="step-card glass-card glass-card-interactive">
                <div class="step-badge-circle">05</div>
                <h3 class="step-title">Follow Your Roadmap</h3>
                <p class="step-desc">Learn, build projects and track your progress toward 80%+ job readiness.</p>
                <div class="step-subtext text-xs text-muted">Job-Ready Portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           8, 9. FEATURES SECTION (6 INTERACTIVE CARDS)
           ========================================================================== -->
      <section class="features-section" id="features">
        <div class="container">
          <div class="section-intro text-center">
            <span class="badge badge-cyan">Comprehensive Platform</span>
            <h2 class="section-heading-lg">Everything You Need to Build Your Career</h2>
            <p class="section-subtitle">
              One platform to understand your skills, improve your weaknesses and prepare for your dream role.
            </p>
          </div>

          <div class="features-grid-3x2">
            <!-- Feature 1: Career Goal -->
            <div class="feature-card glass-card glass-card-interactive">
              <div class="feature-top-row">
                <div class="feature-icon-badge amber">🎯</div>
                <a routerLink="/onboarding/career-goal" class="feature-link text-primary font-semibold text-xs">
                  <span>Explore</span>
                  <span class="arrow-slide">→</span>
                </a>
              </div>
              <h3 class="feature-name">Career Goal</h3>
              <p class="feature-desc">Choose the career you want and understand the skills required to reach it.</p>
              <div class="feature-mini-widget glass-card">
                <div class="widget-row text-xs">
                  <span class="font-semibold">Track: {{ activeTrack.name }}</span>
                  <span class="badge badge-primary">12 Skills</span>
                </div>
              </div>
            </div>

            <!-- Feature 2: Skill Gap Analysis -->
            <div class="feature-card glass-card glass-card-interactive">
              <div class="feature-top-row">
                <div class="feature-icon-badge red">📊</div>
                <a routerLink="/skill-gap" class="feature-link text-primary font-semibold text-xs">
                  <span>View Gaps</span>
                  <span class="arrow-slide">→</span>
                </a>
              </div>
              <h3 class="feature-name">Skill Gap Analysis</h3>
              <p class="feature-desc">Compare your current skills with the skills required for your target career.</p>
              <div class="feature-mini-widget glass-card">
                <div class="mini-gap-spec text-xs">
                  <span>Current: <strong>45%</strong></span>
                  <span>Required: <strong>80%</strong></span>
                  <span class="text-danger font-bold">Gap: 35%</span>
                </div>
                <div class="progress-bar-container" style="height: 6px; margin-top: 6px;">
                  <div class="progress-bar-fill progress-bar-danger" style="width: 45%;"></div>
                </div>
              </div>
            </div>

            <!-- Feature 3: Resume Analysis -->
            <div class="feature-card glass-card glass-card-interactive">
              <div class="feature-top-row">
                <div class="feature-icon-badge purple">📄</div>
                <a routerLink="/resume" class="feature-link text-primary font-semibold text-xs">
                  <span>Test ATS</span>
                  <span class="arrow-slide">→</span>
                </a>
              </div>
              <h3 class="feature-name">Resume Analysis</h3>
              <p class="feature-desc">Understand how well your resume represents your skills and career potential.</p>
              <div class="feature-mini-widget glass-card">
                <div class="resume-score-inline text-xs">
                  <span class="font-bold text-success">ATS Score: 78 / 100</span>
                  <span class="badge badge-success">✓ Clean Formatting</span>
                </div>
              </div>
            </div>

            <!-- Feature 4: Learning Roadmap -->
            <div class="feature-card glass-card glass-card-interactive">
              <div class="feature-top-row">
                <div class="feature-icon-badge cyan">🗺️</div>
                <a routerLink="/roadmap" class="feature-link text-primary font-semibold text-xs">
                  <span>Open Roadmap</span>
                  <span class="arrow-slide">→</span>
                </a>
              </div>
              <h3 class="feature-name">Personalized Roadmap</h3>
              <p class="feature-desc">Follow a structured learning path designed around your career goal and skill gaps.</p>
              <div class="feature-mini-widget glass-card">
                <div class="roadmap-mini-flow text-xs">
                  <span class="text-success">✓ Java</span>
                  <span class="bullet">•</span>
                  <span class="text-success">✓ Spring Boot</span>
                  <span class="bullet">•</span>
                  <span class="text-cyan">→ REST API</span>
                  <span class="bullet">•</span>
                  <span class="text-muted">→ Angular</span>
                </div>
              </div>
            </div>

            <!-- Feature 5: Project Recommendations -->
            <div class="feature-card glass-card glass-card-interactive">
              <div class="feature-top-row">
                <div class="feature-icon-badge green">💼</div>
                <a routerLink="/projects" class="feature-link text-primary font-semibold text-xs">
                  <span>Find Projects</span>
                  <span class="arrow-slide">→</span>
                </a>
              </div>
              <h3 class="feature-name">Project Recommendations</h3>
              <p class="feature-desc">Build practical projects that strengthen your skills and improve your portfolio.</p>
              <div class="feature-mini-widget glass-card">
                <div class="widget-row text-xs">
                  <span class="badge badge-primary">3 projects recommended</span>
                  <span class="text-muted">E-Commerce, Portal, Chat</span>
                </div>
              </div>
            </div>

            <!-- Feature 6: AI Career Assistant -->
            <div class="feature-card glass-card glass-card-interactive">
              <div class="feature-top-row">
                <div class="feature-icon-badge indigo">🤖</div>
                <a routerLink="/ai-assistant" class="feature-link text-primary font-semibold text-xs">
                  <span>Ask AI</span>
                  <span class="arrow-slide">→</span>
                </a>
              </div>
              <h3 class="feature-name">AI Career Assistant</h3>
              <p class="feature-desc">Get personalized guidance about learning, projects, interviews and career decisions.</p>
              <div class="feature-mini-widget glass-card">
                <div class="ai-bubble-mini text-xs">
                  <span class="text-secondary">💬 "What should I learn next?"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           10. SKILL GAP VISUAL SECTION
           ========================================================================== -->
      <section class="gap-visual-section" id="skill-gap">
        <div class="container">
          <div class="section-intro text-center">
            <span class="badge badge-danger">Core Diagnostic Engine</span>
            <h2 class="section-heading-lg">Know Exactly What You're Missing</h2>
            <p class="section-subtitle">
              Stop guessing what to learn next. See the difference between your current skills and your career requirements.
            </p>
          </div>

          <!-- Comparison Card -->
          <div class="gap-comparison-master-card glass-card">
            <div class="matrix-grid-2">
              <!-- Left Column: Your Skills -->
              <div class="matrix-column">
                <div class="col-header">
                  <span class="badge badge-primary">Current Level</span>
                  <h3>Your Skills</h3>
                  <p class="text-xs text-muted">Self-assessed competencies</p>
                </div>

                <div class="skill-metric-row">
                  <div class="skill-name-line">
                    <span class="font-semibold">Java</span>
                    <span class="font-bold text-success">75%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill progress-bar-success" style="width: 75%;"></div>
                  </div>
                </div>

                <div class="skill-metric-row alert-gap-row">
                  <div class="skill-name-line">
                    <span class="font-semibold">Spring Boot</span>
                    <span class="font-bold text-danger">45%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill progress-bar-danger" style="width: 45%;"></div>
                  </div>
                  <span class="text-xs text-danger font-semibold">⚠ Needs Improvement</span>
                </div>

                <div class="skill-metric-row">
                  <div class="skill-name-line">
                    <span class="font-semibold">Angular</span>
                    <span class="font-bold text-primary">60%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill progress-bar-primary" style="width: 60%;"></div>
                  </div>
                </div>

                <div class="skill-metric-row">
                  <div class="skill-name-line">
                    <span class="font-semibold">SQL</span>
                    <span class="font-bold text-success">70%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill progress-bar-success" style="width: 70%;"></div>
                  </div>
                </div>
              </div>

              <!-- Center Differential Callout -->
              <div class="gap-center-callout">
                <div class="gap-callout-pill glass-card">
                  <span class="text-xs uppercase text-muted font-bold">BIGGEST SKILL GAP</span>
                  <div class="gap-callout-num text-danger font-extrabold">35%</div>
                  <span class="font-semibold text-sm">Spring Boot Gap</span>
                  <span class="text-xs text-muted">45% vs 80% Target</span>
                </div>
              </div>

              <!-- Right Column: Required For Active Track -->
              <div class="matrix-column">
                <div class="col-header">
                  <span class="badge badge-cyan">Industry Requirement</span>
                  <h3>Required For {{ activeTrack.name }}</h3>
                  <p class="text-xs text-muted">Entry & mid-level engineering benchmark</p>
                </div>

                <div class="skill-metric-row" *ngFor="let m of activeTrack.industrySkills">
                  <div class="skill-name-line">
                    <span class="font-semibold">{{ m.name }}</span>
                    <span class="font-bold text-cyan">{{ m.pct }}%</span>
                  </div>
                  <div class="progress-bar-container">
                    <div class="progress-bar-fill progress-bar-cyan" [style.width.%]="m.pct"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Action CTA -->
            <div class="gap-card-footer">
              <span class="text-secondary text-sm">
                Close your priority skill gaps to push your overall Career Readiness past <strong>80%</strong>.
              </span>
              <a routerLink="/skill-gap" class="btn btn-primary btn-sm">
                <span>Analyze My Skills</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           11. PERSONALIZED ROADMAP SECTION
           ========================================================================== -->
      <section class="roadmap-section" id="roadmap">
        <div class="container">
          <div class="section-intro text-center">
            <span class="badge badge-primary">Sequential Learning</span>
            <h2 class="section-heading-lg">Your Career Path, Clearly Mapped</h2>
            <p class="section-subtitle">
              Turn your career goal into a step-by-step learning journey.
            </p>
          </div>

          <div class="roadmap-card-master glass-card">
            <!-- Stages Pipeline -->
            <div class="stages-pipeline">
              <ng-container *ngFor="let st of activeTrack.roadmapStages; let idx = index; let last = last">
                <div
                  class="stage-step"
                  [class.completed]="idx < 2"
                  [class.active]="idx === 2"
                  [class.upcoming]="idx > 2"
                >
                  <div class="stage-dot" [class.pulse-dot]="idx === 2">{{ idx < 2 ? '✓' : (idx === 2 ? '●' : '○') }}</div>
                  <span class="stage-label" [class.active-label]="idx === 2">{{ st }}</span>
                  <span class="stage-status-badge badge badge-cyan" *ngIf="idx === 2">Current Focus</span>
                </div>
                <div
                  class="stage-connector"
                  *ngIf="!last"
                  [class.completed]="idx < 2"
                  [class.active]="idx === 2"
                ></div>
              </ng-container>
            </div>

            <!-- Current Focus Highlight Card -->
            <div class="current-focus-card glass-card">
              <div class="focus-left">
                <span class="text-xs text-cyan font-bold uppercase tracking-wider">ACTIVE STAGE DIAGNOSTIC</span>
                <h3 class="focus-title">Current Focus: {{ activeTrack.focusStage }}</h3>
                <p class="text-sm text-secondary">
                  You are <strong>{{ activeTrack.focusPct }}% complete</strong> with core competencies.
                </p>
                <div class="progress-bar-container" style="max-width: 380px; margin: 0.5rem 0 0.75rem;">
                  <div class="progress-bar-fill progress-bar-primary" [style.width.%]="activeTrack.focusPct"></div>
                </div>
                <span class="focus-hint text-xs font-semibold text-warning">
                  Recommended next: <strong>{{ activeTrack.focusNext }}</strong>
                </span>
              </div>

              <a routerLink="/roadmap" class="btn btn-primary btn-sm">
                <span>View Sample Roadmap</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           12. CAREER READINESS SECTION
           ========================================================================== -->
      <section class="readiness-section">
        <div class="container">
          <div class="readiness-master-card glass-card">
            <div class="readiness-grid grid-2">
              <!-- Left: Circular Gauge Showcase -->
              <div class="readiness-gauge-column text-center">
                <span class="badge badge-primary">Verified Metric</span>
                <div class="big-gauge-wrapper">
                  <app-circular-progress
                    [value]="activeTrack.readiness"
                    [size]="190"
                    [strokeWidth]="14"
                    label="Readiness"
                    colorClass="primary"
                  ></app-circular-progress>
                </div>
                <h3 class="gauge-role-title">{{ activeTrack.name }}</h3>
                <p class="text-sm text-secondary">
                  Based on skills, completed projects, and ATS resume keyword scoring.
                </p>
              </div>

              <!-- Right: Strong vs Needs Improvement Triage -->
              <div class="readiness-triage-column">
                <h3 class="triage-heading">Clear Baseline of Where You Stand</h3>
                <p class="text-secondary text-sm" style="margin-bottom: 1.5rem;">
                  CareerAI eliminates uncertainty by categorizing your competencies into actionable priorities.
                </p>

                <!-- Strong Skills List -->
                <div class="triage-group">
                  <span class="triage-tag text-success font-bold text-xs uppercase tracking-wider">
                    ✓ Strong Skills (Meet Industry Standard):
                  </span>
                  <div class="triage-chips">
                    <span class="badge badge-success">✓ {{ activeTrack.skills[0].name }} ({{ activeTrack.skills[0].pct }}%)</span>
                    <span class="badge badge-success">✓ {{ activeTrack.skills[3].name }} ({{ activeTrack.skills[3].pct }}%)</span>
                    <span class="badge badge-success">✓ {{ activeTrack.skills[2].name }} ({{ activeTrack.skills[2].pct }}%)</span>
                  </div>
                </div>

                <!-- Needs Improvement List -->
                <div class="triage-group" style="margin-top: 1.25rem;">
                  <span class="triage-tag text-warning font-bold text-xs uppercase tracking-wider">
                    ⚠ Needs Improvement (Target in Roadmap):
                  </span>
                  <div class="triage-chips">
                    <span class="badge badge-warning">⚠ {{ activeTrack.skills[1].name }} ({{ activeTrack.skills[1].pct }}%)</span>
                    <span class="badge badge-danger">⚠ Cloud & Microservices</span>
                    <span class="badge badge-danger">⚠ CI/CD Testing</span>
                  </div>
                </div>

                <div class="triage-cta-row" style="margin-top: 2rem;">
                  <a routerLink="/register" class="btn btn-primary btn-sm">
                    Calculate My Career Readiness →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           13. AI ASSISTANT PREVIEW (INTERACTIVE CHAT DEMO)
           ========================================================================== -->
      <section class="ai-preview-section">
        <div class="container">
          <div class="section-intro text-center">
            <span class="badge badge-primary">24/7 Intelligent Mentor</span>
            <h2 class="section-heading-lg">Your Career Questions, Answered</h2>
            <p class="section-subtitle">
              Get personalized guidance whenever you're unsure what to learn, build or improve.
            </p>
          </div>

          <div class="chat-preview-card glass-card">
            <!-- Chat Window Header -->
            <div class="chat-chrome-header">
              <div class="chrome-dots">
                <span class="dot red"></span>
                <span class="dot yellow"></span>
                <span class="dot green"></span>
              </div>
              <span class="chrome-title">CareerAI Assistant • Personalized Mode</span>
              <span class="badge badge-success">● Ready</span>
            </div>

            <!-- Chat Content -->
            <div class="chat-conversation-area">
              <!-- Student Message -->
              <div class="chat-row student-row">
                <div class="chat-bubble student-bubble">
                  <p>{{ activeExchange.student }}</p>
                </div>
                <div class="chat-avatar student-avatar">P</div>
              </div>

              <!-- AI Message -->
              <div class="chat-row ai-row">
                <div class="chat-avatar ai-avatar">
                  <app-icon name="sparkles" [size]="16"></app-icon>
                </div>
                <div class="chat-bubble ai-bubble">
                  <p [innerHTML]="activeExchange.ai"></p>
                </div>
              </div>
            </div>

            <!-- Interactive Quick Prompt Pills -->
            <div class="quick-prompts-footer">
              <span class="text-xs text-muted font-semibold">CLICK TO TEST IN ACTION:</span>
              <div class="prompts-grid-chips">
                <button
                  type="button"
                  class="prompt-pill-btn"
                  *ngFor="let p of promptKeys"
                  [class.active]="selectedPromptKey === p"
                  (click)="onSelectPrompt(p)"
                >
                  {{ p }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           14. STUDENT SUCCESS / VALUE SECTION (TRANSFORMATION)
           ========================================================================== -->
      <section class="transformation-section" id="transformation">
        <div class="container">
          <div class="section-intro text-center">
            <span class="badge badge-cyan">The Student Transformation</span>
            <h2 class="section-heading-lg">From Confused to Career-Ready</h2>
            <p class="section-subtitle">
              How CareerAI bridges the gap between college theory and landing your first developer job.
            </p>
          </div>

          <div class="transformation-grid grid-3">
            <!-- Stage 1: Before -->
            <div class="trans-card glass-card before-card">
              <div class="trans-badge">BEFORE</div>
              <h3 class="trans-quote">"I don't know what skills I need."</h3>
              <ul class="trans-bullets">
                <li>Watching random YouTube playlists with no structure</li>
                <li>Uncertain whether college courses match real job requirements</li>
                <li>Generic resume getting filtered out by applicant tracking systems</li>
              </ul>
            </div>

            <!-- Stage 2: With CareerAI -->
            <div class="trans-card glass-card with-card highlight-border">
              <div class="trans-badge badge-gradient">WITH CAREERAI</div>
              <h3 class="trans-quote text-gradient">"I know exactly what I should learn."</h3>
              <ul class="trans-bullets">
                <li>Algorithmic diagnostic calculates exact percentage gaps (e.g. 35% in Spring Boot)</li>
                <li>Curated 9-stage sequential roadmap removes analysis paralysis</li>
                <li>Built-in ATS scanner ensures your resume passes recruiter filters</li>
              </ul>
            </div>

            <!-- Stage 3: After -->
            <div class="trans-card glass-card after-card">
              <div class="trans-badge badge-success-outline">AFTER</div>
              <h3 class="trans-quote">"I'm ready to apply for jobs."</h3>
              <ul class="trans-bullets">
                <li>Verified 80%+ Career Readiness benchmark score</li>
                <li>Production-grade portfolio projects showcasing full-stack integration</li>
                <li>Confidence during technical interviews with AI-guided preparation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           15. FINAL CTA
           ========================================================================== -->
      <section class="final-cta-section">
        <div class="container">
          <div class="cta-master-banner glass-card text-center">
            <div class="cta-glow-orb"></div>

            <div class="cta-content">
              <h2 class="cta-heading">Your Career Starts With Knowing What to Learn.</h2>
              <p class="cta-subtext">
                Discover your skill gaps, build your roadmap and take the next step toward your dream career.
              </p>

              <div class="cta-buttons-row">
                <a routerLink="/register" class="btn btn-primary btn-lg cta-primary-btn">
                  <span>Start My Career Journey</span>
                  <span class="arrow-glyph">→</span>
                </a>
                <button (click)="scrollTo('features')" class="btn btn-secondary btn-lg">
                  Explore Features
                </button>
              </div>

              <span class="text-xs text-muted" style="margin-top: 1.25rem; display: block;">
                Free student registration • Instant skill gap diagnostic • No credit card required
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================================================
           16. FOOTER
           ========================================================================== -->
      <footer class="landing-footer">
        <div class="container">
          <div class="footer-top-grid">
            <!-- Brand description -->
            <div class="footer-brand-col">
              <a routerLink="/" class="footer-logo">
                <div class="logo-symbol mini">
                  <app-icon name="sparkles" [size]="16"></app-icon>
                </div>
                <span class="brand-name">Career<span class="text-gradient">AI</span></span>
              </a>
              <p class="footer-brand-desc text-sm text-secondary">
                AI-powered career guidance for the next generation of developers and professionals.
              </p>
              <span class="badge badge-primary" style="margin-top: 0.75rem;">
                Student Career Platform 2026
              </span>
            </div>

            <!-- Column 1: Product -->
            <div class="footer-links-col">
              <h4 class="footer-col-title">Product</h4>
              <a (click)="scrollTo('features')">Features</a>
              <a routerLink="/skill-gap">Skill Gap Analysis</a>
              <a routerLink="/roadmap">Roadmap</a>
              <a routerLink="/projects">Projects</a>
              <a routerLink="/resume">Resume Analysis</a>
            </div>

            <!-- Column 2: Resources -->
            <div class="footer-links-col">
              <h4 class="footer-col-title">Resources</h4>
              <a routerLink="/about">About</a>
              <a (click)="scrollTo('how-it-works')">How It Works</a>
              <a routerLink="/onboarding/career-goal">Career Guides</a>
              <a routerLink="/ai-assistant">AI Career Assistant</a>
            </div>

            <!-- Column 3: Account -->
            <div class="footer-links-col">
              <h4 class="footer-col-title">Account</h4>
              <a routerLink="/login">Login</a>
              <a routerLink="/register">Register</a>
              <a routerLink="/dashboard">Student Dashboard</a>
              <a routerLink="/settings">Settings</a>
            </div>
          </div>

          <!-- Bottom bar -->
          <div class="footer-bottom-bar">
            <span class="text-xs text-muted">© 2026 CareerAI. All rights reserved.</span>
            <div class="footer-bottom-legal">
              <a routerLink="/about" class="text-xs text-muted">Privacy Policy</a>
              <a routerLink="/about" class="text-xs text-muted">Terms of Service</a>
              <a routerLink="/about" class="text-xs text-muted">Student Guarantee</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* Master Wrapper */
    .landing-wrapper {
      position: relative;
      background: var(--bg-app);
      color: var(--text-primary);
      overflow-x: hidden;
      min-height: 100vh;
    }

    /* Ambient Background Glows */
    .glow-orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(140px);
      pointer-events: none;
      z-index: 0;
      opacity: 0.18;
    }
    .hero-orb-left {
      top: -50px;
      left: 10%;
      width: 500px;
      height: 500px;
      background: var(--primary);
    }
    .hero-orb-right {
      top: 150px;
      right: 5%;
      width: 450px;
      height: 450px;
      background: var(--secondary);
    }
    .mid-orb {
      top: 1200px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 600px;
      background: var(--accent-cyan);
      opacity: 0.08;
    }

    /* ==========================================================================
       2. NAVBAR STYLES
       ========================================================================== */
    .landing-navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 72px;
      display: flex;
      align-items: center;
      background: transparent;
      border-bottom: 1px solid transparent;
      transition: all 0.25s ease-in-out;
    }
    .landing-navbar.scrolled {
      background: var(--bg-glass);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-color);
      box-shadow: var(--shadow-sm);
    }
    .navbar-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .navbar-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
    }
    .logo-symbol {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 14px rgba(99, 102, 241, 0.3);
    }
    .logo-symbol.mini {
      width: 28px;
      height: 28px;
    }
    .brand-name {
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }
    .nav-link {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      font-weight: 500;
      cursor: pointer;
      transition: color var(--transition-fast);
    }
    .nav-link:hover {
      color: var(--primary);
    }
    .navbar-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .mobile-menu-toggle {
      display: none;
      color: var(--text-primary);
      padding: 0.4rem;
    }
    .mobile-drawer {
      position: absolute;
      top: 72px;
      left: 0;
      right: 0;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-color);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: var(--shadow-lg);
      animation: slideDown 0.2s ease-out;
    }
    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .mobile-nav-link {
      font-size: 1.05rem;
      font-weight: 600;
      color: var(--text-primary);
      cursor: pointer;
    }
    .mobile-drawer-actions {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }
    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      z-index: 999;
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ==========================================================================
       3, 4, 5. HERO SECTION STYLES
       ========================================================================== */
    .hero-section {
      padding: 4.5rem 0 5rem;
      position: relative;
      z-index: 1;
    }
    .hero-container {
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      align-items: center;
      gap: 3.5rem;
    }
    .hero-badge-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.9rem;
      background: var(--primary-light);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: var(--radius-full);
      font-size: 0.8125rem;
      font-weight: 600;
      color: #818cf8;
      margin-bottom: 1.25rem;
    }
    .badge-sparkle {
      color: #06b6d4;
    }
    .hero-title {
      font-size: 3.35rem;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.025em;
      margin-bottom: 1.35rem;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-secondary);
      line-height: 1.65;
      margin-bottom: 2rem;
      max-width: 540px;
    }
    .hero-cta-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
      flex-wrap: wrap;
    }
    .arrow-glyph {
      display: inline-block;
      transition: transform var(--transition-fast);
    }
    .hero-cta-btn:hover .arrow-glyph {
      transform: translateX(4px);
    }
    .hero-trust-tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8125rem;
      color: var(--text-muted);
      flex-wrap: wrap;
    }
    .dot-separator {
      color: var(--primary);
    }

    /* Floating Hero Visual */
    .hero-visual-wrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .hero-track-switcher {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      margin-bottom: 1.15rem;
      width: 100%;
      max-width: 440px;
      position: relative;
      z-index: 5;
    }
    .hero-track-pill {
      flex: 1;
      padding: 0.4rem 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: var(--radius-full);
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #334155;
      cursor: pointer;
      white-space: nowrap;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      transition: all var(--transition-fast);
    }
    .hero-track-pill:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    .hero-track-pill.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 2px 10px rgba(79, 70, 229, 0.28);
    }
    .visual-glow-ring {
      position: absolute;
      inset: -15px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%);
      filter: blur(25px);
      z-index: 0;
    }
    .hero-dashboard-card {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 440px;
      padding: 1.85rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
    }
    .dash-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.25rem;
    }
    .dash-role-title {
      font-size: 1.15rem;
      margin-top: 0.25rem;
    }
    .pulse-badge {
      animation: pulseGreen 2s infinite;
    }
    @keyframes pulseGreen {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.65; }
    }
    .readiness-gauge-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem 0 1.25rem;
    }
    .readiness-caption {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .caption-metric {
      font-size: 1.1rem;
    }

    /* Skills Mini Cards inside Hero */
    .hero-skills-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .skill-mini-card {
      padding: 0.75rem 0.85rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-sm);
      position: relative;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .skill-mini-card:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    }
    .skill-mini-card.alert-card {
      border-color: rgba(244, 63, 94, 0.35);
    }
    .skill-mini-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.35rem;
      font-size: 0.8125rem;
    }
    .skill-mini-tooltip {
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      background: #000;
      color: #fff;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      z-index: 10;
      pointer-events: none;
      animation: fadeIn 0.15s ease-in;
    }

    /* Floating Layered Cards */
    .floating-chip {
      position: absolute;
      z-index: 3;
      padding: 0.85rem 1.15rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .gap-chip {
      top: -20px;
      right: -25px;
      width: 195px;
    }
    .step-chip {
      bottom: -20px;
      left: -25px;
      width: 220px;
    }
    .chip-top {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .chip-body {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chip-title {
      font-size: 0.85rem;
    }
    .chip-delta {
      font-size: 0.75rem;
    }
    .chip-status-pill {
      align-self: flex-start;
      font-size: 0.6875rem;
      padding: 0.15rem 0.45rem;
    }

    /* Floating animation keyframes */
    .float-anim-1 {
      animation: floatSubtle 4s ease-in-out infinite;
    }
    .float-anim-2 {
      animation: floatSubtle 4.5s ease-in-out infinite 1s;
    }
    @keyframes floatSubtle {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-7px); }
    }

    /* ==========================================================================
       6. TRUST STRIP
       ========================================================================== */
    .trust-strip-section {
      padding: 1.5rem 0 3.5rem;
      position: relative;
      z-index: 1;
    }
    .trust-strip-card {
      padding: 1.25rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      flex-wrap: wrap;
    }
    .trust-pillars-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .pillar-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    .pillar-divider {
      width: 1px;
      height: 20px;
      background: var(--border-subtle);
    }

    /* ==========================================================================
       7. HOW IT WORKS
       ========================================================================== */
    .how-it-works-section {
      padding: 5rem 0;
      position: relative;
      z-index: 1;
    }
    .section-intro {
      max-width: 700px;
      margin: 0 auto 3.5rem;
    }
    .section-heading-lg {
      font-size: 2.35rem;
      font-weight: 800;
      margin: 0.75rem 0 0.5rem;
      letter-spacing: -0.02em;
    }
    .section-subtitle {
      color: var(--text-secondary);
      font-size: 1.05rem;
      line-height: 1.6;
    }
    .timeline-container {
      position: relative;
      margin-top: 2rem;
    }
    .timeline-track-line {
      position: absolute;
      top: 32px;
      left: 40px;
      right: 40px;
      height: 2px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent-cyan) 100%);
      opacity: 0.35;
      z-index: 0;
    }
    .timeline-steps-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 1.25rem;
      position: relative;
      z-index: 1;
    }
    .step-card {
      padding: 1.75rem 1.25rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      height: 100%;
    }
    .step-badge-circle {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      border: 2px solid var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
      color: var(--primary);
      margin-bottom: 0.75rem;
      box-shadow: 0 0 14px rgba(99, 102, 241, 0.3);
    }
    .step-title {
      font-size: 1.05rem;
    }
    .step-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      flex: 1;
    }
    .step-subtext {
      margin-top: auto;
    }

    /* ==========================================================================
       8, 9. FEATURES GRID (3x2)
       ========================================================================== */
    .features-section {
      padding: 5rem 0;
      position: relative;
      z-index: 1;
    }
    .features-grid-3x2 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
    }
    .feature-card {
      padding: 2rem 1.75rem;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      position: relative;
      transition: all var(--transition-normal);
    }
    .feature-card:hover {
      transform: translateY(-4px);
      border-color: rgba(99, 102, 241, 0.45);
      box-shadow: var(--shadow-lg), 0 0 20px rgba(99, 102, 241, 0.15);
    }
    .feature-top-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .feature-icon-badge {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
    }
    .feature-icon-badge.amber { background: var(--warning-light); }
    .feature-icon-badge.red { background: var(--danger-light); }
    .feature-icon-badge.purple { background: var(--secondary-light); }
    .feature-icon-badge.cyan { background: var(--accent-cyan-light); }
    .feature-icon-badge.green { background: var(--success-light); }
    .feature-icon-badge.indigo { background: var(--primary-light); }

    .feature-link {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    .arrow-slide {
      transition: transform var(--transition-fast);
    }
    .feature-card:hover .arrow-slide {
      transform: translateX(4px);
    }
    .feature-name {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    .feature-desc {
      font-size: 0.8875rem;
      color: var(--text-secondary);
      line-height: 1.55;
      margin-bottom: 1.5rem;
      flex: 1;
    }
    .feature-mini-widget {
      padding: 0.75rem 0.95rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .widget-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mini-gap-spec {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .resume-score-inline {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .roadmap-mini-flow {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      flex-wrap: wrap;
    }
    .ai-bubble-mini {
      color: var(--primary);
      font-style: italic;
    }

    /* ==========================================================================
       10. SKILL GAP SECTION
       ========================================================================== */
    .gap-visual-section {
      padding: 5rem 0;
      position: relative;
      z-index: 1;
    }
    .gap-comparison-master-card {
      padding: 2.75rem;
      background: var(--bg-surface);
      border: 1px solid rgba(244, 63, 94, 0.25);
    }
    .matrix-grid-2 {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 2.5rem;
    }
    .matrix-column {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .col-header h3 {
      font-size: 1.25rem;
      margin: 0.4rem 0 0.15rem;
    }
    .skill-metric-row {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .skill-metric-row.alert-gap-row {
      background: rgba(244, 63, 94, 0.06);
      padding: 0.65rem 0.75rem;
      border-radius: var(--radius-sm);
      border-left: 3px solid var(--danger);
    }
    .skill-name-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    .gap-center-callout {
      display: flex;
      justify-content: center;
    }
    .gap-callout-pill {
      padding: 1.75rem 1.5rem;
      background: var(--bg-surface-elevated);
      border: 1px solid rgba(244, 63, 94, 0.35);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      box-shadow: 0 0 25px rgba(244, 63, 94, 0.18);
    }
    .gap-callout-num {
      font-size: 2.75rem;
      line-height: 1;
    }
    .gap-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 2.5rem;
      padding-top: 1.75rem;
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 1rem;
    }

    /* ==========================================================================
       11. PERSONALIZED ROADMAP SECTION
       ========================================================================== */
    .roadmap-section {
      padding: 5rem 0;
      position: relative;
      z-index: 1;
    }
    .roadmap-card-master {
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .stages-pipeline {
      display: flex;
      align-items: center;
      overflow-x: auto;
      padding: 1rem 0.5rem;
      gap: 0.4rem;
    }
    .stage-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      min-width: 95px;
      position: relative;
    }
    .stage-dot {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--text-muted);
      margin-bottom: 0.5rem;
    }
    .stage-step.completed .stage-dot {
      background: var(--success-light);
      color: var(--success);
      border-color: var(--success);
    }
    .stage-step.active .stage-dot {
      background: var(--accent-cyan-light);
      color: var(--accent-cyan);
      border-color: var(--accent-cyan);
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.5);
    }
    .pulse-dot {
      animation: pulseGlowCyan 1.8s infinite;
    }
    @keyframes pulseGlowCyan {
      0%, 100% { box-shadow: 0 0 0 0 rgba(6, 182, 212, 0.5); }
      50% { box-shadow: 0 0 0 8px rgba(6, 182, 212, 0); }
    }
    .stage-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      white-space: nowrap;
    }
    .stage-label.active-label {
      color: var(--accent-cyan);
      font-weight: 700;
    }
    .stage-status-badge {
      margin-top: 0.35rem;
      font-size: 0.65rem;
    }
    .stage-connector {
      flex: 1;
      height: 2px;
      min-width: 20px;
      background: var(--border-subtle);
      margin-bottom: 1.5rem;
    }
    .stage-connector.completed { background: var(--success); }
    .stage-connector.active { background: var(--accent-cyan); }

    .current-focus-card {
      padding: 1.5rem 2rem;
      background: var(--bg-surface-elevated);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      border: 1px solid rgba(6, 182, 212, 0.3);
      flex-wrap: wrap;
    }
    .focus-title {
      font-size: 1.25rem;
      margin: 0.25rem 0;
    }

    /* ==========================================================================
       12. CAREER READINESS SECTION
       ========================================================================== */
    .readiness-section {
      padding: 5rem 0;
      position: relative;
      z-index: 1;
    }
    .readiness-master-card {
      padding: 3rem;
      background: var(--bg-surface);
      border: 1px solid rgba(99, 102, 241, 0.25);
    }
    .readiness-gauge-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
    }
    .big-gauge-wrapper {
      margin: 1.75rem 0 1.25rem;
    }
    .gauge-role-title {
      font-size: 1.45rem;
      margin-bottom: 0.35rem;
    }
    .triage-heading {
      font-size: 1.85rem;
      margin-bottom: 0.5rem;
    }
    .triage-group {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .triage-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    /* ==========================================================================
       13. AI ASSISTANT PREVIEW
       ========================================================================== */
    .ai-preview-section {
      padding: 5rem 0;
      position: relative;
      z-index: 1;
    }
    .chat-preview-card {
      max-width: 860px;
      margin: 0 auto;
      overflow: hidden;
      border: 1px solid var(--border-color);
      box-shadow: var(--shadow-lg);
    }
    .chat-chrome-header {
      padding: 0.85rem 1.5rem;
      background: var(--bg-surface-elevated);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }
    .chrome-dots {
      display: flex;
      gap: 6px;
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .dot.red { background: #ef4444; }
    .dot.yellow { background: #f59e0b; }
    .dot.green { background: #10b981; }
    .chrome-title {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .chat-conversation-area {
      padding: 2.25rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      background: var(--bg-surface);
      min-height: 240px;
    }
    .chat-row {
      display: flex;
      gap: 1rem;
      align-items: flex-start;
      max-width: 85%;
    }
    .student-row {
      margin-left: auto;
      flex-direction: row;
    }
    .ai-row {
      margin-right: auto;
    }
    .chat-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 0.9rem;
      flex-shrink: 0;
    }
    .student-avatar {
      background: var(--accent-cyan-light);
      color: var(--accent-cyan);
      border: 1px solid var(--accent-cyan);
    }
    .ai-avatar {
      background: var(--gradient-primary);
      color: #fff;
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }
    .chat-bubble {
      padding: 1.15rem 1.35rem;
      border-radius: var(--radius-lg);
      font-size: 0.9375rem;
      line-height: 1.6;
    }
    .student-bubble {
      background: var(--primary);
      color: #fff;
      border-bottom-right-radius: 4px;
    }
    .ai-bubble {
      background: var(--bg-surface-elevated);
      color: var(--text-primary);
      border: 1px solid var(--border-color);
      border-bottom-left-radius: 4px;
    }
    .quick-prompts-footer {
      padding: 1.25rem 2rem;
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-surface-elevated);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .prompts-grid-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .prompt-pill-btn {
      padding: 0.45rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.8125rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .prompt-pill-btn:hover {
      border-color: var(--primary);
      color: var(--primary);
      background: var(--primary-light);
    }
    .prompt-pill-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
    }

    /* ==========================================================================
       14. STUDENT SUCCESS / TRANSFORMATION
       ========================================================================== */
    .transformation-section {
      padding: 5rem 0;
      position: relative;
      z-index: 1;
    }
    .transformation-grid {
      gap: 1.75rem;
    }
    .trans-card {
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      position: relative;
    }
    .trans-card.highlight-border {
      border-color: var(--primary);
      box-shadow: 0 0 30px rgba(99, 102, 241, 0.15);
    }
    .trans-badge {
      display: inline-block;
      align-self: flex-start;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
    }
    .badge-gradient {
      background: var(--gradient-primary);
      color: #fff;
    }
    .badge-success-outline {
      background: var(--success-light);
      color: var(--success);
      border: 1px solid var(--success);
    }
    .trans-quote {
      font-size: 1.25rem;
      line-height: 1.4;
    }
    .trans-bullets {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-top: 0.5rem;
    }
    .trans-bullets li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }
    .before-card .trans-bullets li::before {
      content: '✕';
      position: absolute;
      left: 0;
      color: var(--danger);
      font-weight: bold;
    }
    .with-card .trans-bullets li::before {
      content: '✦';
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }
    .after-card .trans-bullets li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success);
      font-weight: bold;
    }

    /* ==========================================================================
       15. FINAL CTA
       ========================================================================== */
    .final-cta-section {
      padding: 5rem 0 6rem;
      position: relative;
      z-index: 1;
    }
    .cta-master-banner {
      padding: 5rem 2.5rem;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%);
      border: 1px solid rgba(99, 102, 241, 0.35);
      position: relative;
      overflow: hidden;
    }
    .cta-glow-orb {
      position: absolute;
      top: -50%;
      left: 50%;
      transform: translateX(-50%);
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%);
      pointer-events: none;
    }
    .cta-content {
      position: relative;
      z-index: 2;
      max-width: 720px;
      margin: 0 auto;
    }
    .cta-heading {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      line-height: 1.2;
    }
    .cta-subtext {
      color: var(--text-secondary);
      font-size: 1.15rem;
      line-height: 1.6;
      margin-bottom: 2.25rem;
    }
    .cta-buttons-row {
      display: flex;
      justify-content: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    /* ==========================================================================
       16. FOOTER
       ========================================================================== */
    .landing-footer {
      background: var(--bg-surface);
      border-top: 1px solid var(--border-color);
      padding: 4.5rem 0 2.5rem;
      position: relative;
      z-index: 1;
    }
    .footer-top-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }
    .footer-brand-desc {
      line-height: 1.6;
      max-width: 320px;
    }
    .footer-col-title {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-primary);
      margin-bottom: 1.25rem;
    }
    .footer-links-col {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .footer-links-col a {
      color: var(--text-muted);
      font-size: 0.9rem;
      cursor: pointer;
      transition: color var(--transition-fast);
    }
    .footer-links-col a:hover {
      color: var(--primary);
    }
    .footer-bottom-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 2rem;
      border-top: 1px solid var(--border-subtle);
      flex-wrap: wrap;
      gap: 1rem;
    }
    .footer-bottom-legal {
      display: flex;
      gap: 1.5rem;
    }
    .footer-bottom-legal a:hover {
      color: var(--primary);
    }

    /* ==========================================================================
       18. RESPONSIVE BREAKPOINTS
       ========================================================================== */
    @media (max-width: 1080px) {
      .hero-title { font-size: 2.75rem; }
      .timeline-steps-grid { grid-template-columns: repeat(3, 1fr); }
      .features-grid-3x2 { grid-template-columns: repeat(2, 1fr); }
      .matrix-grid-2 { grid-template-columns: 1fr; }
      .gap-center-callout { order: -1; }
      .footer-top-grid { grid-template-columns: 1fr 1fr; }
    }

    @media (max-width: 860px) {
      .hero-container { grid-template-columns: 1fr; gap: 3.5rem; text-align: center; }
      .hero-subtitle { margin: 0 auto 2rem; }
      .hero-cta-row { justify-content: center; }
      .hero-trust-tag { justify-content: center; }
      .desktop-nav { display: none; }
      .mobile-menu-toggle { display: block; }
      .timeline-track-line { display: none; }
      .timeline-steps-grid { grid-template-columns: 1fr; }
      .features-grid-3x2 { grid-template-columns: 1fr; }
      .transformation-grid { grid-template-columns: 1fr; }
      .trust-strip-card { flex-direction: column; text-align: center; }
      .trust-pillars-row { justify-content: center; }
      .pillar-divider { display: none; }
      .gap-card-footer { flex-direction: column; text-align: center; }
      .current-focus-card { flex-direction: column; text-align: center; }
      .readiness-grid { grid-template-columns: 1fr; text-align: center; }
      .triage-chips { justify-content: center; }
      .triage-cta-row { display: flex; justify-content: center; }
      .footer-top-grid { grid-template-columns: 1fr; gap: 2rem; }
      .footer-bottom-bar { flex-direction: column; text-align: center; }
    }

    @media (max-width: 520px) {
      .hero-title { font-size: 2.15rem; }
      .floating-chip { display: none; } /* Hide floating chips on extra-small mobile to prevent clutter */
      .hero-dashboard-card { padding: 1.25rem; }
      .hero-skills-grid { grid-template-columns: 1fr; }
      .cta-heading { font-size: 1.85rem; }
      .cta-buttons-row { flex-direction: column; }
      .cta-buttons-row .btn { width: 100%; }
    }
  `]
})
export class LandingComponent implements OnInit {
  public isScrolled: boolean = false;
  public isMobileMenuOpen: boolean = false;
  public hoveredSkill: string | null = null;

  public showcaseTracks = [
    {
      id: 'python',
      label: '🐍 Python Full Stack',
      name: 'Python Full Stack Developer',
      readiness: 68,
      nextStepTitle: 'Master FastAPI & Async APIs',
      nextStepTime: '⏱ 2 weeks',
      focusStage: 'FastAPI & Async REST APIs',
      focusPct: 45,
      focusNext: 'Redis Caching & Celery Background Tasks',
      skills: [
        { name: 'Python', pct: 75, target: 85, level: 'Advanced', color: 'success', gap: 10 },
        { name: 'FastAPI', pct: 45, target: 80, level: 'Intermediate', color: 'danger', gap: 35 },
        { name: 'Angular / React', pct: 60, target: 75, level: 'Intermediate', color: 'primary', gap: 15 },
        { name: 'PostgreSQL', pct: 70, target: 80, level: 'Advanced', color: 'success', gap: 10 }
      ],
      industrySkills: [
        { name: 'Python 3.12 Core & OOP', pct: 85, color: 'cyan' },
        { name: 'FastAPI & Pydantic Validation', pct: 80, color: 'cyan' },
        { name: 'PostgreSQL & ORM Modeling', pct: 80, color: 'cyan' },
        { name: 'Redis & Background Queues', pct: 75, color: 'cyan' },
        { name: 'Docker & AWS Deployment', pct: 70, color: 'cyan' }
      ],
      roadmapStages: ['Python 3.12', 'PostgreSQL', 'FastAPI & Async', 'Redis & Celery', 'Frontend UI', 'Docker CI/CD'],
      aiPrompts: {
        'What should I learn next?': {
          student: 'What should I learn next to become an industry-ready Python Full Stack Developer?',
          ai: 'Based on your <strong>Python Full Stack</strong> goal, your highest ROI next step is <strong>FastAPI & Asynchronous Architecture</strong>. Your backend score is currently at <strong>45%</strong> with a 35% gap. Mastering async endpoints, dependency injection, and Pydantic schemas will quickly elevate your career readiness!'
        },
        'Am I job-ready?': {
          student: 'Am I ready to apply for junior Python Full Stack roles right now?',
          ai: 'You are currently at <strong>68% Career Readiness</strong>. Your foundational skills in Python (75%) and PostgreSQL (70%) are strong. Closing your gaps in <strong>Docker containerization</strong> and <strong>Redis/Celery async tasks</strong> will push you past the 80%+ interview threshold.'
        },
        'Suggest a project': {
          student: 'Can you recommend an impressive portfolio project for Python Full Stack?',
          ai: 'I recommend the <strong>Real-Time Analytics & Task Processing Platform</strong>! It pairs a reactive <strong>Angular / React</strong> dashboard with a high-throughput <strong>FastAPI</strong> backend, <strong>PostgreSQL</strong>, and background queue workers using <strong>Celery & Redis</strong>.'
        },
        'Prepare me for interviews': {
          student: 'What are the top 3 interview topics I will be asked about?',
          ai: 'Expect questions on: <strong>1) Python GIL and async/await concurrency</strong>, <strong>2) Database indexing, query plans & transactions</strong>, and <strong>3) RESTful API architecture, idempotency, and JWT auth</strong>.'
        }
      }
    },
    {
      id: 'frontend',
      label: '🎨 Frontend Engineer',
      name: 'Frontend Engineer',
      readiness: 72,
      nextStepTitle: 'Deep Dive into State & Signals',
      nextStepTime: '⏱ 2 weeks',
      focusStage: 'Angular Signals & State Management',
      focusPct: 50,
      focusNext: 'Performance & Web Vitals',
      skills: [
        { name: 'JavaScript / TS', pct: 80, target: 85, level: 'Advanced', color: 'success', gap: 5 },
        { name: 'Angular / React', pct: 65, target: 80, level: 'Intermediate', color: 'primary', gap: 15 },
        { name: 'CSS / Responsive', pct: 75, target: 80, level: 'Advanced', color: 'success', gap: 5 },
        { name: 'State Management', pct: 40, target: 75, level: 'Intermediate', color: 'danger', gap: 35 }
      ],
      industrySkills: [
        { name: 'Modern TypeScript', pct: 85, color: 'cyan' },
        { name: 'Component Architecture', pct: 85, color: 'cyan' },
        { name: 'Reactive State & Signals', pct: 80, color: 'cyan' },
        { name: 'Testing with Jest/Cypress', pct: 70, color: 'cyan' },
        { name: 'Performance & Core Vitals', pct: 75, color: 'cyan' }
      ],
      roadmapStages: ['HTML & Modern CSS', 'ES6+ & TypeScript', 'Component Trees', 'Signals & RxJS', 'Unit Testing', 'Production Build'],
      aiPrompts: {
        'What should I learn next?': {
          student: 'What should I learn next to become an expert Frontend Engineer?',
          ai: 'Based on your <strong>Frontend Engineer</strong> goal, your highest ROI next step is <strong>Reactive Signals and State Management</strong>. Closing your 35% gap in state orchestration will dramatically boost your enterprise front-end readiness!'
        },
        'Am I job-ready?': {
          student: 'Am I ready to apply for junior frontend developer positions?',
          ai: 'You are currently at <strong>72% Career Readiness</strong>. Your foundational JavaScript and UI layout skills are strong! Completing end-to-end testing with Jest/Cypress and performance optimization will unlock recruiter recommendations.'
        },
        'Suggest a project': {
          student: 'Can you recommend an impressive portfolio project to build?',
          ai: 'Build a <strong>Collaborative Real-Time Workspace Canvas</strong>! It highlights state synchronization, optimistic UI updates, keyboard accessibility, and zero-latency drag-and-drop interactions.'
        },
        'Prepare me for interviews': {
          student: 'What are the top 3 interview topics I will be asked about?',
          ai: 'Focus on: <strong>1) Browser event loop, microtasks & rendering phases</strong>, <strong>2) Component re-render optimization & memoization</strong>, and <strong>3) Clean API client architecture with RxJS/Promises</strong>.'
        }
      }
    },
    {
      id: 'ai',
      label: '🤖 AI/ML Engineer',
      name: 'AI / ML Engineer',
      readiness: 58,
      nextStepTitle: 'Train Deep Learning Models in PyTorch',
      nextStepTime: '⏱ 3 weeks',
      focusStage: 'Neural Networks & PyTorch',
      focusPct: 35,
      focusNext: 'LLM Fine-Tuning & Vector DBs',
      skills: [
        { name: 'Python', pct: 80, target: 85, level: 'Advanced', color: 'success', gap: 5 },
        { name: 'Mathematics & Stats', pct: 65, target: 80, level: 'Intermediate', color: 'primary', gap: 15 },
        { name: 'PyTorch / Deep Learning', pct: 35, target: 80, level: 'Beginner', color: 'danger', gap: 45 },
        { name: 'Vector DBs & RAG', pct: 30, target: 75, level: 'Beginner', color: 'danger', gap: 45 }
      ],
      industrySkills: [
        { name: 'Python & NumPy/Pandas', pct: 85, color: 'cyan' },
        { name: 'PyTorch Deep Learning', pct: 80, color: 'cyan' },
        { name: 'LLMs, LangChain & Vector DBs', pct: 75, color: 'cyan' },
        { name: 'Model Evaluation & Metrics', pct: 75, color: 'cyan' },
        { name: 'MLOps & Docker Deployment', pct: 70, color: 'cyan' }
      ],
      roadmapStages: ['Math & Stats', 'Data Wrangling', 'PyTorch Basics', 'Computer Vision/NLP', 'RAG & LLM Agents', 'MLOps & CI/CD'],
      aiPrompts: {
        'What should I learn next?': {
          student: 'What should I learn next to become an AI/ML Engineer?',
          ai: 'Based on your <strong>AI/ML Engineer</strong> track, your highest priority is <strong>PyTorch Deep Learning Fundamentals</strong>. Building neural networks from scratch and training on GPUs will give you the practical edge.'
        },
        'Am I job-ready?': {
          student: 'Am I ready for entry-level machine learning positions?',
          ai: 'You are currently at <strong>58% Career Readiness</strong>. While your Python scripting and data analysis are solid, mastering <strong>vector databases (Chroma/Pinecone)</strong> and <strong>model deployment</strong> will prepare you for hiring.'
        },
        'Suggest a project': {
          student: 'Can you recommend an impressive AI portfolio project?',
          ai: 'Build an <strong>Autonomous Multi-Modal RAG Assistant</strong> that ingests complex PDF documents, indexes them in a vector database, and generates verified citations with streaming response!'
        },
        'Prepare me for interviews': {
          student: 'What are the top 3 interview topics I will be asked about?',
          ai: 'Expect deep questions on: <strong>1) Gradient descent optimizers & backpropagation math</strong>, <strong>2) Overfitting mitigation & regularization</strong>, and <strong>3) Transformer architecture attention mechanisms</strong>.'
        }
      }
    },
    {
      id: 'data',
      label: '📊 Data Analyst',
      name: 'Data Analyst & BI Specialist',
      readiness: 65,
      nextStepTitle: 'Build Executive KPI Dashboards',
      nextStepTime: '⏱ 2 weeks',
      focusStage: 'Power BI & Advanced SQL',
      focusPct: 40,
      focusNext: 'Statistical Hypothesis Testing',
      skills: [
        { name: 'SQL Queries', pct: 85, target: 90, level: 'Advanced', color: 'success', gap: 5 },
        { name: 'Python Pandas', pct: 60, target: 75, level: 'Intermediate', color: 'primary', gap: 15 },
        { name: 'Power BI / Tableau', pct: 40, target: 80, level: 'Intermediate', color: 'danger', gap: 40 },
        { name: 'Statistics', pct: 55, target: 75, level: 'Intermediate', color: 'primary', gap: 20 }
      ],
      industrySkills: [
        { name: 'Advanced SQL & CTEs', pct: 90, color: 'cyan' },
        { name: 'Executive Power BI & DAX', pct: 80, color: 'cyan' },
        { name: 'Python Data Wrangling', pct: 75, color: 'cyan' },
        { name: 'A/B Testing & Statistics', pct: 75, color: 'cyan' },
        { name: 'Data Storytelling', pct: 70, color: 'cyan' }
      ],
      roadmapStages: ['Excel & Data Prep', 'SQL Window Functions', 'Python Analytics', 'Power BI & DAX', 'Hypothesis Testing', 'Executive Portfolios'],
      aiPrompts: {
        'What should I learn next?': {
          student: 'What should I learn next to become an enterprise Data Analyst?',
          ai: 'Based on your <strong>Data Analyst</strong> track, your highest priority is <strong>DAX calculations and interactive dashboard storytelling in Power BI</strong>. Executive visibility is the #1 skill recruiters assess.'
        },
        'Am I job-ready?': {
          student: 'Am I ready for junior data analyst roles?',
          ai: 'You are currently at <strong>65% Career Readiness</strong>. Your SQL foundations (85%) are outstanding! Finalizing your interactive BI portfolio dashboards will make you an irresistible candidate.'
        },
        'Suggest a project': {
          student: 'Can you recommend an impressive portfolio project to build?',
          ai: 'Build a <strong>SaaS Customer Churn & Lifetime Value (LTV) Executive Dashboard</strong> combining cohort analysis, SQL queries, and predictive churn metrics in Power BI.'
        },
        'Prepare me for interviews': {
          student: 'What are the top 3 interview topics I will be asked about?',
          ai: 'Expect questions on: <strong>1) SQL Window functions (ROW_NUMBER vs RANK vs DENSE_RANK)</strong>, <strong>2) Cohort retention analysis</strong>, and <strong>3) A/B test sample sizing & p-value interpretation</strong>.'
        }
      }
    }
  ];

  public selectedShowcaseIndex: number = 0;

  public get activeTrack() {
    return this.showcaseTracks[this.selectedShowcaseIndex];
  }

  public promptKeys: string[] = [
    'What should I learn next?',
    'Am I job-ready?',
    'Suggest a project',
    'Prepare me for interviews'
  ];

  public selectedPromptKey: string = 'What should I learn next?';

  public get activeExchange(): ChatPreviewExchange {
    const prompts = this.activeTrack.aiPrompts as Record<string, ChatPreviewExchange>;
    return prompts[this.selectedPromptKey] || prompts['What should I learn next?'];
  }

  ngOnInit(): void {
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  public onWindowScroll(): void {
    this.checkScroll();
  }

  private checkScroll(): void {
    this.isScrolled = window.scrollY > 20;
  }

  public toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  public closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  public scrollTo(elementId: string): void {
    const el = document.getElementById(elementId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  public onSelectTrack(index: number): void {
    this.selectedShowcaseIndex = index;
  }

  public onSelectPrompt(key: string): void {
    this.selectedPromptKey = key;
  }
}
