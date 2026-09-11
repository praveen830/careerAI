import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService } from '../../../core/services/student.service';
import { RoadmapService } from '../../../core/services/roadmap.service';
import { StudentProfile } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-page">
      <!-- 1. Welcome Section -->
      <section class="dashboard-welcome-hero glass-card">
        <div class="welcome-left">
          <div class="welcome-header-row">
            <h1 class="welcome-title">Hello, {{ firstName }} 👋</h1>
            <span class="online-pill">
              <span class="pulse-dot"></span>
              <span>Active Session</span>
            </span>
          </div>
          <p class="welcome-subtitle">Let's continue building your personalized career roadmap.</p>

          <div class="goal-strip">
            <span class="goal-label">Target Career Goal:</span>
            <div class="goal-switcher-container">
              <span class="goal-badge">
                <app-icon name="target" [size]="16"></app-icon>
                <strong id="dashboard-current-goal">{{ profile.careerGoal || 'Python Full Stack Developer' }}</strong>
              </span>
              <select
                class="goal-dropdown"
                [value]="profile.careerGoal || 'Python Full Stack Developer'"
                (change)="onSwitchGoal($event)"
                title="Quick Switch Career Track"
              >
                <option value="Python Full Stack Developer">🐍 Python Full Stack Developer</option>
                <option value="Frontend Developer">🎨 Frontend Developer</option>
                <option value="Data Analyst">📊 Data Analyst</option>
                <option value="AI/ML Engineer">🤖 AI/ML Engineer</option>
                <option value="DevOps Engineer">⚙️ DevOps Engineer</option>
                <option value="Java Full Stack Developer">☕ Java Full Stack Developer</option>
                <option value="Backend Developer">🔧 Backend Developer</option>
              </select>
            </div>
            <a routerLink="/onboarding/career-goal" class="btn btn-sm btn-ghost change-goal-btn">
              All Tracks →
            </a>
          </div>
        </div>

        <div class="welcome-right">
          <div class="streak-card">
            <div class="streak-icon">🔥</div>
            <div class="streak-meta">
              <span class="streak-days">{{ profile.streakDays || 7 }} Days</span>
              <span class="streak-desc">Preparation Streak</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Top Row: Career Readiness & Recommended Next Step -->
      <div class="dashboard-grid-2">
        <!-- CAREER READINESS CARD -->
        <section class="readiness-card glass-card">
          <div class="card-top-row">
            <div class="card-title-wrap">
              <span class="card-eyebrow">CAREER BENCHMARK</span>
              <h3 class="card-heading">Career Readiness</h3>
            </div>
            <div class="trend-pill success" title="Compared to last month">
              <span class="trend-arrow">↑</span>
              <span>+8% this month</span>
            </div>
          </div>

          <div class="readiness-body">
            <!-- Animated Circular Gauge with Number Count-up -->
            <div class="gauge-container">
              <svg class="readiness-svg" viewBox="0 0 120 120" width="140" height="140">
                <!-- Background track -->
                <circle
                  class="svg-track"
                  cx="60"
                  cy="60"
                  r="50"
                  stroke-width="10"
                />
                <!-- Animated progress stroke -->
                <circle
                  class="svg-bar"
                  cx="60"
                  cy="60"
                  r="50"
                  stroke-width="10"
                  stroke-dasharray="314.159"
                  [style.strokeDashoffset]="gaugeDashOffset"
                />
              </svg>
              <div class="gauge-center-text">
                <span class="gauge-score">{{ animatedScore }}%</span>
                <span class="gauge-sub">Readiness</span>
              </div>
            </div>

            <div class="readiness-info">
              <h4 class="status-title">You're making good progress!</h4>
              <p class="status-desc">
                You're on the right track. Focus on your biggest skill gaps to become job-ready.
              </p>

              <div class="readiness-triage-chips">
                <span class="triage-chip strong">✓ {{ strongSkillsCount }} Strong</span>
                <span class="triage-chip dev">● {{ developingSkillsCount }} Developing</span>
                <span class="triage-chip gap">⚠ {{ gapsCount }} Gaps</span>
              </div>
            </div>
          </div>
        </section>

        <!-- RECOMMENDED NEXT STEP CARD ⭐ -->
        <section class="next-step-card glass-card">
          <div class="card-top-row">
            <div class="card-title-wrap">
              <span class="badge badge-primary pulse-badge">⭐ Priority Recommendation</span>
              <span class="card-eyebrow" style="margin-top: 4px;">NEXT STEP</span>
              <h3 class="card-heading">{{ nextStep.title }}</h3>
            </div>
            <div class="time-badge">
              <app-icon name="clock" [size]="14"></app-icon>
              <span>{{ nextStep.estimatedTime }}</span>
            </div>
          </div>

          <p class="next-step-desc">{{ nextStep.description }}</p>

          <div class="next-step-progress-block">
            <div class="prog-meta">
              <span class="prog-lbl">Current Progress</span>
              <span class="prog-val">{{ nextStep.currentProgress }}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-bar warning" [style.width.%]="nextStep.currentProgress"></div>
            </div>
          </div>

          <div class="next-step-actions">
            <a routerLink="/roadmap" class="btn btn-primary btn-md">
              Continue Learning →
            </a>
            <a routerLink="/roadmap" class="btn btn-secondary btn-md">
              View Roadmap
            </a>
          </div>
        </section>
      </div>

      <!-- 3. Middle Row: Skills Overview & Biggest Skill Gaps -->
      <div class="dashboard-grid-2">
        <!-- SKILLS OVERVIEW -->
        <section class="skills-overview-card glass-card">
          <div class="card-top-row">
            <div>
              <h3 class="card-heading">Your Skills</h3>
              <p class="card-subtext">See how your current skills compare to your career goal.</p>
            </div>
            <a routerLink="/onboarding/skills" class="btn btn-sm btn-ghost">+ Manage Skills</a>
          </div>

          <div class="skills-list">
            <div class="skill-row" *ngFor="let s of skills">
              <div class="skill-info-top">
                <span class="skill-name">{{ s.name }}</span>
                <div class="skill-meta-right">
                  <span class="skill-pct">{{ s.proficiency }}%</span>
                  <span class="skill-status-tag" [ngClass]="s.status.toLowerCase().replace(' ', '-')">
                    {{ s.status }}
                  </span>
                </div>
              </div>
              <div class="skill-bar-track">
                <div
                  class="skill-bar-fill"
                  [ngClass]="s.colorClass"
                  [style.width.%]="s.proficiency">
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SKILL GAP SECTION -->
        <section class="skill-gap-card glass-card">
          <div class="card-top-row">
            <div>
              <div class="gap-title-group">
                <span class="gap-alert-icon">⚠</span>
                <h3 class="card-heading">Your Biggest Skill Gaps</h3>
              </div>
              <p class="card-subtext">Address these bottlenecks to accelerate your job readiness score.</p>
            </div>
            <span class="badge badge-danger">3 Priority</span>
          </div>

          <div class="gap-items-list">
            <div class="gap-item-card" *ngFor="let g of skillGaps">
              <div class="gap-item-header">
                <div class="gap-name-wrap">
                  <span class="gap-warning-bullet">⚠</span>
                  <span class="gap-skill-name">{{ g.name }}</span>
                </div>
                <div class="gap-ratio">
                  <span class="cur-score">{{ g.current }}%</span>
                  <span class="ratio-arrow">→</span>
                  <span class="req-score">{{ g.required }}%</span>
                </div>
              </div>

              <!-- Dual progress bar track (Current vs Required) -->
              <div class="gap-progress-track">
                <!-- Required marker background -->
                <div class="gap-required-fill" [style.width.%]="g.required"></div>
                <!-- Current proficiency -->
                <div class="gap-current-fill" [style.width.%]="g.current"></div>
              </div>

              <div class="gap-footer-meta">
                <span class="gap-priority-tag">{{ g.priority }} Priority</span>
                <span class="gap-diff text-danger">-{{ g.gap }}% Gap</span>
              </div>
            </div>
          </div>

          <div class="gap-cta-row">
            <a routerLink="/skill-gap" class="btn btn-outline btn-block">
              View Skill Gap Analysis →
            </a>
          </div>
        </section>
      </div>

      <!-- 4. Full Width: Learning Roadmap Preview -->
      <section class="roadmap-preview-card glass-card">
        <div class="card-top-row">
          <div>
            <h3 class="card-heading">Your Learning Roadmap</h3>
            <p class="card-subtext">Step-by-step career milestones curated for {{ profile.careerGoal || 'your target role' }}.</p>
          </div>
          <a routerLink="/roadmap" class="btn btn-sm btn-outline">View Full Roadmap →</a>
        </div>

        <div class="roadmap-timeline-scroll">
          <div class="roadmap-timeline-track">
            <div
              class="roadmap-step-node"
              *ngFor="let step of roadmapSteps; let i = index"
              [ngClass]="step.status">
              <div class="node-icon-ring">
                <span *ngIf="step.status === 'completed'" class="status-symbol">✓</span>
                <span *ngIf="step.status === 'in-progress'" class="status-symbol pulse">●</span>
                <span *ngIf="step.status === 'upcoming'" class="status-symbol">○</span>
              </div>
              <div class="node-content">
                <span class="step-num">STAGE {{ i + 1 }}</span>
                <span class="step-title">{{ step.title }}</span>
                <span class="step-badge" *ngIf="step.status === 'in-progress'">
                  {{ step.progress }}% complete
                </span>
                <span class="step-badge completed" *ngIf="step.status === 'completed'">Done</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Bottom Row: Quick Actions & AI Assistant Preview -->
      <div class="dashboard-grid-2">
        <!-- QUICK ACTIONS -->
        <section class="quick-actions-card glass-card">
          <div class="card-top-row">
            <div>
              <h3 class="card-heading">Quick Actions</h3>
              <p class="card-subtext">Direct shortcuts to career development tools.</p>
            </div>
          </div>

          <div class="quick-actions-grid">
            <a
              *ngFor="let a of quickActions"
              [routerLink]="a.route"
              class="quick-action-item glass-card-interactive">
              <div class="qa-icon" [ngClass]="a.colorClass">
                <app-icon [name]="a.icon" [size]="20"></app-icon>
              </div>
              <div class="qa-content">
                <h4 class="qa-title">{{ a.title }}</h4>
                <p class="qa-desc">{{ a.description }}</p>
              </div>
              <span class="qa-arrow">→</span>
            </a>
          </div>
        </section>

        <!-- AI CAREER ASSISTANT PREVIEW -->
        <section class="ai-assistant-preview-card glass-card">
          <div class="card-top-row">
            <div class="ai-header-left">
              <div class="ai-icon-glow">
                <app-icon name="sparkles" [size]="20"></app-icon>
              </div>
              <div>
                <h3 class="card-heading">CareerAI Assistant</h3>
                <p class="card-subtext">Your personal career guide.</p>
              </div>
            </div>
            <span class="badge badge-cyan">24/7 AI</span>
          </div>

          <!-- Mock Conversation Bubble -->
          <div class="chat-mockup-body">
            <!-- Student Message -->
            <div class="chat-message student-msg">
              <div class="msg-avatar student-av">P</div>
              <div class="msg-bubble">
                <p class="msg-text">What should I learn next?</p>
                <span class="msg-time">Just now</span>
              </div>
            </div>

            <!-- AI Mentor Message -->
            <div class="chat-message ai-msg">
              <div class="msg-avatar ai-av">
                <app-icon name="sparkles" [size]="14"></app-icon>
              </div>
              <div class="msg-bubble">
                <p class="msg-text">
                  Based on your <strong>{{ profile.careerGoal || 'target career' }}</strong> goal, I recommend focusing on
                  <strong>{{ nextStep.title }}</strong> next. {{ nextStep.description }}
                </p>
                <span class="msg-time">CareerAI Advisor</span>
              </div>
            </div>
          </div>

          <div class="ai-card-footer">
            <a routerLink="/ai-assistant" class="btn btn-primary btn-block">
              Ask CareerAI →
            </a>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* 1. Welcome Hero — Clean Solid White Card */
    .dashboard-welcome-hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2rem 2.25rem;
      background: #ffffff !important;
      border: 1px solid #e2e8f0 !important;
      border-radius: var(--radius-lg);
      position: relative;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 14px rgba(15, 23, 42, 0.03) !important;
    }
    .welcome-header-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.35rem;
    }
    .welcome-title {
      font-size: 1.85rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }
    .online-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.65rem;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--success);
      font-size: 0.72rem;
      font-weight: 600;
      border-radius: var(--radius-full);
    }
    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--success);
      box-shadow: 0 0 8px var(--success);
      animation: dotPulse 2s infinite;
    }
    @keyframes dotPulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.5; }
    }
    .welcome-subtitle {
      font-size: 0.95rem;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
    }
    .goal-strip {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .goal-label {
      font-size: 0.82rem;
      color: var(--text-muted);
      font-weight: 600;
    }
    .goal-switcher-container {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .goal-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-md);
      background: rgba(79, 70, 229, 0.08);
      border: 1px solid rgba(79, 70, 229, 0.25);
      color: var(--primary);
      font-size: 0.85rem;
    }
    .goal-dropdown {
      padding: 0.35rem 0.65rem;
      border-radius: var(--radius-sm);
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      outline: none;
      transition: all var(--transition-fast);
    }
    .goal-dropdown:hover,
    .goal-dropdown:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
    }
    .change-goal-btn {
      font-size: 0.78rem;
      padding: 0.25rem 0.65rem;
    }
    .streak-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.35rem;
      border-radius: var(--radius-md);
      background: #fffbeb !important;
      border: 1px solid #fde68a !important;
    }
    .streak-icon {
      font-size: 2rem;
      animation: float 3s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-4px); }
    }
    .streak-meta {
      display: flex;
      flex-direction: column;
    }
    .streak-days {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--warning);
    }
    .streak-desc {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Grids */
    .dashboard-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.75rem;
    }

    /* Common Card Styles */
    .card-top-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .card-eyebrow {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      font-weight: 600;
    }
    .card-heading {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0.2rem 0 0 0;
    }
    .card-subtext {
      font-size: 0.82rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0 0;
    }

    /* 2. Career Readiness Card */
    .readiness-card {
      padding: 1.75rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .trend-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      font-weight: 600;
    }
    .trend-pill.success {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--success);
    }
    .readiness-body {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin-top: 0.75rem;
    }
    .gauge-container {
      position: relative;
      width: 140px;
      height: 140px;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .readiness-svg {
      transform: rotate(-90deg);
      overflow: visible;
    }
    .svg-track {
      fill: none;
      stroke: var(--bg-surface-elevated);
    }
    .svg-bar {
      fill: none;
      stroke: var(--primary);
      stroke-linecap: round;
      filter: drop-shadow(0 0 8px rgba(99, 102, 241, 0.5));
      transition: stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .gauge-center-text {
      position: absolute;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .gauge-score {
      font-size: 2rem;
      font-weight: 800;
      color: var(--text-primary);
      line-height: 1;
    }
    .gauge-sub {
      font-size: 0.72rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 4px;
    }
    .readiness-info {
      flex: 1;
    }
    .status-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.4rem;
    }
    .status-desc {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1.25rem;
    }
    .readiness-triage-chips {
      display: flex;
      gap: 0.6rem;
      flex-wrap: wrap;
    }
    .triage-chip {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-sm);
    }
    .triage-chip.strong { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .triage-chip.dev { background: rgba(6, 182, 212, 0.15); color: var(--accent-cyan); }
    .triage-chip.gap { background: rgba(239, 68, 68, 0.15); color: #f87171; }

    /* Recommended Next Step Card ⭐ */
    .next-step-card {
      padding: 1.75rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 1px solid rgba(99, 102, 241, 0.35);
      position: relative;
    }
    .pulse-badge {
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary);
      font-size: 0.7rem;
      margin-bottom: 0.4rem;
      display: inline-block;
    }
    .time-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.3rem 0.75rem;
      background: var(--bg-surface-elevated);
      border-radius: var(--radius-full);
      font-size: 0.78rem;
      color: var(--text-secondary);
    }
    .next-step-desc {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0.75rem 0 1.25rem 0;
    }
    .next-step-progress-block {
      margin-bottom: 1.5rem;
    }
    .prog-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      margin-bottom: 0.45rem;
    }
    .prog-lbl { color: var(--text-muted); }
    .prog-val { font-weight: 700; color: var(--warning); }
    .progress-track {
      height: 8px;
      border-radius: 4px;
      background: var(--bg-surface-elevated);
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      border-radius: 4px;
      transition: width 1s ease-in-out;
    }
    .progress-bar.warning { background: var(--warning); box-shadow: 0 0 8px rgba(245, 158, 11, 0.4); }
    .next-step-actions {
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
    }

    /* 3. Skills Overview */
    .skills-overview-card {
      padding: 1.75rem 2rem;
    }
    .skills-list {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      margin-top: 1.25rem;
    }
    .skill-row {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .skill-info-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .skill-name {
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .skill-meta-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .skill-pct {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-secondary);
    }
    .skill-status-tag {
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.15rem 0.55rem;
      border-radius: var(--radius-sm);
    }
    .skill-status-tag.strong {
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
    }
    .skill-status-tag.needs-improvement {
      background: rgba(245, 158, 11, 0.15);
      color: var(--warning);
    }
    .skill-status-tag.developing {
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan);
    }
    .skill-bar-track {
      height: 7px;
      border-radius: 4px;
      background: var(--bg-surface-elevated);
      overflow: hidden;
    }
    .skill-bar-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 1s ease-in-out;
    }
    .skill-bar-fill.success { background: var(--success); box-shadow: 0 0 6px rgba(16, 185, 129, 0.4); }
    .skill-bar-fill.warning { background: var(--warning); box-shadow: 0 0 6px rgba(245, 158, 11, 0.4); }
    .skill-bar-fill.cyan { background: var(--accent-cyan); box-shadow: 0 0 6px rgba(6, 182, 212, 0.4); }
    .skill-bar-fill.purple { background: #a855f7; box-shadow: 0 0 6px rgba(168, 85, 247, 0.4); }

    /* Skill Gap Card */
    .skill-gap-card {
      padding: 1.75rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .gap-title-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .gap-alert-icon {
      color: var(--warning);
      font-size: 1.1rem;
    }
    .gap-items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 1.25rem 0;
    }
    .gap-item-card {
      padding: 0.9rem 1.15rem;
      border-radius: var(--radius-md);
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      transition: transform var(--transition-fast), border-color var(--transition-fast), box-shadow var(--transition-fast);
    }
    .gap-item-card:hover {
      transform: translateX(3px);
      border-color: #cbd5e1;
      background: #ffffff;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }
    .gap-item-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .gap-name-wrap {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }
    .gap-warning-bullet {
      color: var(--warning);
      font-size: 0.85rem;
    }
    .gap-skill-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .gap-ratio {
      font-size: 0.85rem;
      font-weight: 700;
    }
    .cur-score { color: #f87171; }
    .ratio-arrow { color: var(--text-muted); margin: 0 0.25rem; }
    .req-score { color: var(--success); }
    .gap-progress-track {
      position: relative;
      height: 7px;
      border-radius: 4px;
      background: var(--bg-surface-elevated);
      overflow: hidden;
      margin-bottom: 0.45rem;
    }
    .gap-required-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: rgba(16, 185, 129, 0.35);
      border-radius: 4px;
    }
    .gap-current-fill {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      background: #f87171;
      border-radius: 4px;
      box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
    }
    .gap-footer-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.72rem;
    }
    .gap-priority-tag {
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .gap-diff {
      font-weight: 700;
    }
    .gap-cta-row {
      margin-top: 0.5rem;
    }

    /* 4. Roadmap Preview */
    .roadmap-preview-card {
      padding: 1.75rem 2rem;
    }
    .roadmap-timeline-scroll {
      overflow-x: auto;
      padding: 1.5rem 0.5rem 1rem 0.5rem;
    }
    .roadmap-timeline-track {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      min-width: 900px;
      position: relative;
    }
    .roadmap-timeline-track::before {
      content: '';
      position: absolute;
      top: 17px;
      left: 20px;
      right: 20px;
      height: 2px;
      background: var(--border-color);
      z-index: 1;
    }
    .roadmap-step-node {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      position: relative;
      z-index: 2;
    }
    .node-icon-ring {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--bg-surface);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      font-size: 0.9rem;
      transition: all var(--transition-fast);
    }
    .roadmap-step-node.completed .node-icon-ring {
      border-color: var(--success);
      background: rgba(16, 185, 129, 0.15);
      color: var(--success);
    }
    .roadmap-step-node.in-progress .node-icon-ring {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.25);
      color: var(--primary);
      box-shadow: 0 0 15px rgba(99, 102, 241, 0.5);
    }
    .roadmap-step-node.upcoming .node-icon-ring {
      color: var(--text-muted);
      border-style: dashed;
    }
    .status-symbol.pulse {
      animation: pulse 1.5s infinite;
    }
    .node-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .step-num {
      font-size: 0.68rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .step-title {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0.2rem 0;
      line-height: 1.3;
    }
    .step-badge {
      font-size: 0.7rem;
      padding: 0.15rem 0.5rem;
      border-radius: var(--radius-sm);
      background: rgba(99, 102, 241, 0.2);
      color: var(--primary);
      font-weight: 600;
    }
    .step-badge.completed {
      background: rgba(16, 185, 129, 0.2);
      color: var(--success);
    }

    /* 5. Quick Actions & AI Assistant */
    .quick-actions-card {
      padding: 1.75rem 2rem;
    }
    .quick-actions-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-top: 1.25rem;
    }
    .quick-action-item {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1rem;
      border-radius: var(--radius-md);
      background: #ffffff;
      border: 1px solid #e2e8f0;
      text-decoration: none;
      transition: all var(--transition-fast);
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.03);
    }
    .quick-action-item:hover {
      transform: translateY(-2px);
      border-color: var(--primary);
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.08);
      background: #f8faff;
    }
    .qa-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .qa-icon.primary { background: rgba(99, 102, 241, 0.2); color: var(--primary); }
    .qa-icon.cyan { background: rgba(6, 182, 212, 0.2); color: var(--accent-cyan); }
    .qa-icon.emerald { background: rgba(16, 185, 129, 0.2); color: var(--success); }
    .qa-icon.purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; }
    .qa-content { flex: 1; }
    .qa-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 0.15rem 0;
    }
    .qa-desc {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0;
    }
    .qa-arrow {
      color: var(--text-muted);
      font-weight: 700;
      transition: transform var(--transition-fast);
    }
    .quick-action-item:hover .qa-arrow {
      transform: translateX(4px);
      color: var(--primary);
    }

    /* AI Assistant Card */
    .ai-assistant-preview-card {
      padding: 1.75rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .ai-header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .ai-icon-glow {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-md);
      background: var(--gradient-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.45);
    }
    .chat-mockup-body {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
      margin: 1.25rem 0;
      padding: 1.15rem;
      background: #f8fafc;
      border-radius: var(--radius-md);
      border: 1px solid #e2e8f0;
    }
    .chat-message {
      display: flex;
      gap: 0.65rem;
      align-items: flex-start;
    }
    .chat-message.student-msg {
      flex-direction: row-reverse;
    }
    .msg-avatar {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .student-av {
      background: var(--gradient-primary);
      color: #fff;
    }
    .ai-av {
      background: rgba(6, 182, 212, 0.15);
      color: var(--accent-cyan);
      border: 1px solid rgba(6, 182, 212, 0.3);
    }
    .msg-bubble {
      max-width: 82%;
      padding: 0.65rem 0.95rem;
      border-radius: var(--radius-md);
      font-size: 0.82rem;
      line-height: 1.45;
    }
    .student-msg .msg-bubble {
      background: var(--primary);
      color: #fff;
      border-bottom-right-radius: 2px;
    }
    .ai-msg .msg-bubble {
      background: #ffffff;
      color: var(--text-primary);
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 2px;
    }
    .msg-text { margin: 0 0 0.25rem 0; }
    .msg-time {
      font-size: 0.65rem;
      opacity: 0.75;
      display: block;
    }
    .ai-card-footer {
      margin-top: 0.5rem;
    }

    /* Responsive Design */
    @media (max-width: 1100px) {
      .dashboard-grid-2 {
        grid-template-columns: 1fr;
      }
      .quick-actions-grid {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 768px) {
      .dashboard-welcome-hero {
        flex-direction: column;
        align-items: flex-start;
        gap: 1.25rem;
        padding: 1.5rem;
      }
      .welcome-title {
        font-size: 1.5rem;
      }
      .readiness-body {
        flex-direction: column;
        text-align: center;
        gap: 1.25rem;
      }
      .readiness-triage-chips {
        justify-content: center;
      }
      .readiness-card,
      .next-step-card,
      .skills-overview-card,
      .skill-gap-card,
      .roadmap-preview-card,
      .quick-actions-card,
      .ai-assistant-preview-card {
        padding: 1.25rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  public profile!: StudentProfile;
  public firstName: string = 'Praveen';
  public targetScore: number = 68;
  public animatedScore: number = 0;
  public gaugeDashOffset: number = 314.159;

  // Typed Mock Data loaded from StudentService
  public skills: any[] = [];
  public skillGaps: any[] = [];
  public nextStep: any = {
    title: 'Master FastAPI & Asynchronous Architecture',
    description: 'High-throughput asynchronous APIs and background tasks with Celery/Redis are your top priority gaps for Python Full Stack Developer.',
    estimatedTime: '2 weeks',
    currentProgress: 45,
    targetRole: 'Python Full Stack Developer'
  };
  public roadmapSteps: any[] = [];
  public quickActions: any[] = [];

  private sub = new Subscription();
  private countInterval: any = null;

  constructor(
    private studentService: StudentService,
    private roadmapService: RoadmapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Load student profile
    this.sub.add(
      this.studentService.profile$.subscribe(p => {
        this.profile = p;
        if (p?.fullName) {
          this.firstName = p.fullName.split(' ')[0];
        }
        const currentGoal = p?.careerGoal || 'Python Full Stack Developer';
        this.refreshDashboardForGoal(currentGoal, false);
      })
    );

    this.quickActions = this.studentService.getQuickActions();
  }

  public get strongSkillsCount(): number {
    return this.skills.filter(s => s.status === 'Strong').length;
  }

  public get developingSkillsCount(): number {
    return this.skills.filter(s => s.status === 'Developing').length;
  }

  public get gapsCount(): number {
    return this.skillGaps.length;
  }

  public onSwitchGoal(event: any): void {
    const newGoal = event.target.value;
    if (newGoal) {
      this.studentService.setCareerGoal(newGoal);
      this.refreshDashboardForGoal(newGoal, true);
    }
  }

  public refreshDashboardForGoal(goal: string, shouldAnimate: boolean = true): void {
    this.skills = this.studentService.getDashboardSkills(goal);
    this.skillGaps = this.studentService.getBiggestSkillGaps(goal);
    this.nextStep = this.studentService.getNextStepRecommendation(goal);
    this.roadmapSteps = this.studentService.getRoadmapSteps(goal);
    this.roadmapService.loadRoadmapForGoal(goal);

    // Compute tailored score
    const lower = goal.toLowerCase();
    if (lower.includes('frontend')) this.targetScore = 72;
    else if (lower.includes('data')) this.targetScore = 65;
    else if (lower.includes('ai') || lower.includes('ml')) this.targetScore = 58;
    else if (lower.includes('devops')) this.targetScore = 62;
    else this.targetScore = 68;

    if (shouldAnimate) {
      this.triggerReadinessAnimation();
    } else {
      this.animatedScore = this.targetScore;
      const circumference = 2 * Math.PI * 50;
      this.gaugeDashOffset = circumference - (this.targetScore / 100) * circumference;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.countInterval) {
      clearInterval(this.countInterval);
      this.countInterval = null;
    }
  }

  /**
   * Number count-up and circular progress animation
   */
  private triggerReadinessAnimation(): void {
    const circumference = 2 * Math.PI * 50; // ~314.159
    const targetOffset = circumference - (this.targetScore / 100) * circumference;

    // Reset before animating
    this.animatedScore = 0;
    this.gaugeDashOffset = circumference;

    setTimeout(() => {
      // Trigger smooth CSS transition for stroke
      this.gaugeDashOffset = targetOffset;

      // Animate score counter
      const duration = 900; // ms
      const steps = 30;
      const stepTime = duration / steps;
      const increment = this.targetScore / steps;
      let current = 0;

      if (this.countInterval) clearInterval(this.countInterval);
      this.countInterval = setInterval(() => {
        current += increment;
        if (current >= this.targetScore) {
          this.animatedScore = this.targetScore;
          clearInterval(this.countInterval);
          this.countInterval = null;
        } else {
          this.animatedScore = Math.round(current);
        }
      }, stepTime);
    }, 150);
  }
}
