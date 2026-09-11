import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentService } from '../../../core/services/student.service';
import { SkillGapService } from '../../../core/services/skill-gap.service';
import { ToastService } from '../../../core/services/toast.service';
import { SkillGapItem } from '../../../core/models';

@Component({
  selector: 'app-skill-gap',
  template: `
    <div class="skill-gap-page">
      <!-- Header Banner -->
      <section class="page-banner glass-card">
        <div class="banner-content">
          <div class="banner-badge-row">
            <span class="badge badge-danger">Algorithmic Diagnostic</span>
            <span class="badge badge-primary">Readiness: {{ readinessScore }}%</span>
          </div>
          <h1>Skill Gap Analysis: {{ displayGoalName }}</h1>
          <p class="text-secondary">
            Comparing your self-assessed technical competencies against standard entry & mid-level hiring benchmarks for {{ displayGoalName }}.
          </p>
          <div class="banner-actions">
            <button
              type="button"
              class="btn btn-primary btn-sm analyze-btn"
              [disabled]="isAnalyzing"
              (click)="triggerAnalysis()"
              id="analyze-skill-gap-btn"
            >
              <span *ngIf="!isAnalyzing">⚡ Re-Analyze Competencies</span>
              <span *ngIf="isAnalyzing">Analyzing Engine...</span>
            </button>
          </div>
        </div>

        <div class="banner-metrics">
          <div class="metric-item">
            <span class="metric-num text-danger">{{ criticalSkills.length }}</span>
            <span class="metric-lbl">Critical Gaps</span>
          </div>
          <div class="metric-item">
            <span class="metric-num text-warning">{{ improveSkills.length }}</span>
            <span class="metric-lbl">To Improve</span>
          </div>
          <div class="metric-item">
            <span class="metric-num text-success">{{ strongSkills.length }}</span>
            <span class="metric-lbl">Strong Skills</span>
          </div>
        </div>
      </section>

      <!-- Interactive Comparison Table -->
      <section class="table-section glass-card">
        <div class="section-title-row">
          <div>
            <h3>Competency Comparison Matrix</h3>
            <p class="text-xs text-muted">Current proficiency vs required industry expectation</p>
          </div>
          <div class="filter-pills">
            <button class="pill-btn" [class.active]="activeTab === 'all'" (click)="activeTab = 'all'">All ({{ skillGaps.length }})</button>
            <button class="pill-btn" [class.active]="activeTab === 'critical'" (click)="activeTab = 'critical'">Critical ({{ criticalSkills.length }})</button>
            <button class="pill-btn" [class.active]="activeTab === 'improve'" (click)="activeTab = 'improve'">To Improve ({{ improveSkills.length }})</button>
            <button class="pill-btn" [class.active]="activeTab === 'strong'" (click)="activeTab = 'strong'">Strong ({{ strongSkills.length }})</button>
          </div>
        </div>

        <!-- Loading State -->
        <div class="loading-state" *ngIf="isLoading">
          <div class="spinner"></div>
          <p class="text-sm text-secondary">Computing skill gap diagnostics from backend engine...</p>
        </div>

        <div class="table-responsive" *ngIf="!isLoading">
          <table class="gap-table">
            <thead>
              <tr>
                <th>Skill Name</th>
                <th>Current Level</th>
                <th>Required Level</th>
                <th>Gap Level</th>
                <th>Severity</th>
                <th>Visual Differential</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of filteredSkills">
                <td class="font-semibold">
                  <div class="skill-name-cell">
                    <span>{{ s.skillName }}</span>
                  </div>
                </td>
                <td>
                  <span class="font-bold">{{ s.currentLevel }} / 5</span>
                  <span class="text-xs text-muted"> ({{ s.currentLevel * 20 }}%)</span>
                </td>
                <td>
                  <span class="font-bold text-cyan">{{ s.requiredLevel }} / 5</span>
                  <span class="text-xs text-muted"> ({{ s.requiredLevel * 20 }}%)</span>
                </td>
                <td>
                  <span class="font-bold" [ngClass]="getGapTextColor(s.gapLevel)">
                    {{ s.gapLevel }}
                  </span>
                </td>
                <td>
                  <span class="badge" [ngClass]="getStatusBadge(s.severity)">{{ s.severity }}</span>
                </td>
                <td class="bar-td">
                  <div class="dual-progress-container">
                    <div class="bar-track">
                      <!-- Current skill bar -->
                      <div
                        class="bar-current"
                        [style.width.%]="s.currentLevel * 20"
                        [ngClass]="getBarClass(s.severity)"
                      ></div>
                      <!-- Target requirement marker -->
                      <div
                        class="target-marker"
                        [style.left.%]="s.requiredLevel * 20"
                        title="Target: Level {{ s.requiredLevel }} ({{ s.requiredLevel * 20 }}%)"
                      ></div>
                    </div>
                  </div>
                </td>
                <td>
                  <a routerLink="/roadmap" class="btn btn-sm btn-ghost action-btn">
                    Close Gap →
                  </a>
                </td>
              </tr>
              <tr *ngIf="filteredSkills.length === 0">
                <td colspan="7" class="text-center text-muted py-4">
                  No skills found matching this category filter.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Three Categorized Diagnostic Cards: Strong, To Improve, Critical -->
      <section class="gap-categories grid-3">
        <!-- 1. Strong Skills -->
        <div class="category-card glass-card">
          <div class="cat-header">
            <span class="badge badge-success">✓ Strong Foundations</span>
            <h4>Ready For Interviewing</h4>
            <p class="text-xs text-muted">You meet or exceed market benchmarks in these subjects.</p>
          </div>
          <div class="cat-list">
            <div class="cat-item" *ngFor="let s of strongSkills">
              <div class="item-name-row">
                <span class="font-semibold">{{ s.skillName }}</span>
                <span class="text-success font-bold">Lvl {{ s.currentLevel }}/{{ s.requiredLevel }}</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill progress-bar-success" [style.width.%]="s.currentLevel * 20"></div>
              </div>
            </div>
            <div class="empty-cat-msg text-xs text-muted" *ngIf="strongSkills.length === 0">
              No strong skills benchmarked yet.
            </div>
          </div>
        </div>

        <!-- 2. Skills To Improve -->
        <div class="category-card glass-card">
          <div class="cat-header">
            <span class="badge badge-warning">⚠ Intermediate Depth</span>
            <h4>Skills To Improve</h4>
            <p class="text-xs text-muted">Moderate gap (1–2 levels). Requires hands-on project practice.</p>
          </div>
          <div class="cat-list">
            <div class="cat-item" *ngFor="let s of improveSkills">
              <div class="item-name-row">
                <span class="font-semibold">{{ s.skillName }}</span>
                <span class="text-warning font-bold">Lvl {{ s.currentLevel }}/{{ s.requiredLevel }} (Gap: {{ s.gapLevel }})</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill progress-bar-warning" [style.width.%]="s.currentLevel * 20"></div>
              </div>
            </div>
            <div class="empty-cat-msg text-xs text-muted" *ngIf="improveSkills.length === 0">
              No moderate gaps detected.
            </div>
          </div>
        </div>

        <!-- 3. Critical Skill Gaps -->
        <div class="category-card glass-card">
          <div class="cat-header">
            <span class="badge badge-danger">⚡ Critical Gaps (≥3 Levels)</span>
            <h4>Highest Priority Focus</h4>
            <p class="text-xs text-muted">Missing or beginner level. Essential for developer interviews.</p>
          </div>
          <div class="cat-list">
            <div class="cat-item" *ngFor="let s of criticalSkills">
              <div class="item-name-row">
                <span class="font-semibold">{{ s.skillName }}</span>
                <span class="text-danger font-bold">Lvl {{ s.currentLevel }}/{{ s.requiredLevel }} (Gap: {{ s.gapLevel }})</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill progress-bar-danger" [style.width.%]="s.currentLevel * 20"></div>
              </div>
            </div>
            <div class="empty-cat-msg text-xs text-muted" *ngIf="criticalSkills.length === 0">
              No critical skill gaps! You're on track.
            </div>
          </div>
        </div>
      </section>

      <!-- Actionable Advice Card -->
      <section class="advice-card glass-card">
        <div class="advice-content">
          <h3>Recommended Action Plan</h3>
          <p class="text-secondary">
            To boost your <strong>Readiness Score (Currently {{ readinessScore }}%)</strong>, focus on closing your top critical gaps. Your learning roadmap is calibrated to these exact milestones.
          </p>
        </div>
        <div class="advice-actions">
          <a routerLink="/roadmap" class="btn btn-primary">Open Learning Roadmap</a>
          <a routerLink="/ai-assistant" class="btn btn-secondary">Ask AI Assistant for Study Plan</a>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .skill-gap-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1280px;
      margin: 0 auto;
    }
    .page-banner {
      padding: 2.25rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      background: linear-gradient(135deg, #ffffff 0%, #fff1f2 50%, #fdf2f8 100%);
      border: 1px solid #fecdd3;
      border-radius: var(--radius-xl);
      box-shadow: 0 4px 16px rgba(244, 63, 94, 0.04);
    }
    .banner-badge-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .banner-content h1 {
      font-size: 1.85rem;
      margin: 0.25rem 0 0.5rem;
      color: #0f172a;
    }
    .banner-actions {
      margin-top: 1rem;
    }
    .banner-metrics {
      display: flex;
      gap: 1.5rem;
      flex-shrink: 0;
    }
    .metric-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: var(--bg-surface-elevated, #ffffff);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--border-subtle, #e2e8f0);
    }
    .metric-num {
      font-size: 2rem;
      font-weight: 800;
      line-height: 1;
    }
    .metric-lbl {
      font-size: 0.75rem;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }

    /* Table Section */
    .table-section {
      padding: 2rem;
    }
    .section-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .filter-pills {
      display: flex;
      gap: 0.5rem;
    }
    .pill-btn {
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      background: var(--bg-surface-elevated, #f8fafc);
      color: var(--text-secondary, #475569);
      border: 1px solid var(--border-color, #cbd5e1);
      cursor: pointer;
      transition: all var(--transition-fast, 0.2s);
    }
    .pill-btn.active {
      background: var(--primary, #4f46e5);
      color: #ffffff;
      border-color: var(--primary, #4f46e5);
    }
    .table-responsive {
      overflow-x: auto;
    }
    .gap-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .gap-table th {
      padding: 0.85rem 1rem;
      font-size: 0.8rem;
      color: var(--text-muted, #64748b);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border-color, #e2e8f0);
    }
    .gap-table td {
      padding: 1.15rem 1rem;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--border-subtle, #f1f5f9);
      vertical-align: middle;
    }
    .skill-name-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .bar-td {
      min-width: 200px;
    }
    .dual-progress-container {
      width: 100%;
    }
    .bar-track {
      position: relative;
      height: 10px;
      background: #e2e8f0;
      border-radius: var(--radius-full, 9999px);
      overflow: visible;
    }
    .bar-current {
      height: 100%;
      border-radius: var(--radius-full, 9999px);
      transition: width 0.6s ease;
    }
    .target-marker {
      position: absolute;
      top: -3px;
      bottom: -3px;
      width: 3px;
      background: #0f172a;
      border-radius: 2px;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    }
    .action-btn {
      color: var(--primary, #4f46e5);
      font-weight: 600;
    }

    /* Category Cards */
    .category-card {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .cat-header h4 {
      font-size: 1.1rem;
      margin: 0.5rem 0 0.25rem;
    }
    .cat-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .cat-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .item-name-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
    }
    .progress-bar-container {
      height: 6px;
      background: #e2e8f0;
      border-radius: var(--radius-full, 9999px);
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: var(--radius-full, 9999px);
      transition: width 0.5s ease;
    }
    .progress-bar-success { background: #10b981; }
    .progress-bar-warning { background: #f59e0b; }
    .progress-bar-danger  { background: #ef4444; }

    /* Loading State */
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 1rem;
      gap: 1rem;
    }
    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e2e8f0;
      border-top-color: var(--primary, #4f46e5);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Advice Card */
    .advice-card {
      padding: 2rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      background: var(--bg-surface, #ffffff);
      border: 1px solid rgba(99, 102, 241, 0.3);
    }
    .advice-actions {
      display: flex;
      gap: 1rem;
      flex-shrink: 0;
    }

    @media (max-width: 960px) {
      .page-banner { flex-direction: column; text-align: center; }
      .banner-badge-row { justify-content: center; }
      .banner-metrics { justify-content: center; }
      .advice-card { flex-direction: column; text-align: center; }
      .advice-actions { flex-direction: column; width: 100%; }
      .advice-actions .btn { width: 100%; }
    }
  `]
})
export class SkillGapComponent implements OnInit, OnDestroy {
  // Exact contract properties
  public careerGoal: string = 'JAVA_FULL_STACK_DEVELOPER';
  public readinessScore: number = 0;
  public skillGaps: SkillGapItem[] = [];

  // Component UI state
  public activeTab: 'all' | 'critical' | 'improve' | 'strong' = 'all';
  public isLoading: boolean = false;
  public isAnalyzing: boolean = false;

  private sub = new Subscription();

  constructor(
    private skillGapService: SkillGapService,
    private studentService: StudentService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadSkillGap();

    // Listen to profile changes for reactive synchronization
    this.sub.add(
      this.studentService.profile$.subscribe(p => {
        if (p?.careerGoal && this.skillGaps.length === 0) {
          this.careerGoal = p.careerGoal;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public loadSkillGap(): void {
    this.isLoading = true;
    this.sub.add(
      this.skillGapService.getSkillGap().subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res && res.data) {
            this.careerGoal = res.data.careerGoal;
            this.readinessScore = res.data.readinessScore;
            this.skillGaps = res.data.skillGaps || [];
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.warn('Could not load skill gap analysis from backend:', err);
        }
      })
    );
  }

  public triggerAnalysis(): void {
    this.isAnalyzing = true;
    this.sub.add(
      this.skillGapService.analyzeSkillGap(this.careerGoal).subscribe({
        next: (res) => {
          this.isAnalyzing = false;
          if (res && res.data) {
            this.careerGoal = res.data.careerGoal;
            this.readinessScore = res.data.readinessScore;
            this.skillGaps = res.data.skillGaps || [];
            this.toastService.success('Skill gap re-analyzed successfully against current competencies!');
          }
        },
        error: (err) => {
          this.isAnalyzing = false;
          this.toastService.error('Analysis failed: ' + (err.error?.message || err.message));
        }
      })
    );
  }

  // Contract & template compatibility helpers
  public get currentGoal(): string {
    return this.careerGoal;
  }

  public get skills(): SkillGapItem[] {
    return this.skillGaps;
  }

  public get displayGoalName(): string {
    if (!this.careerGoal) return 'Java Full Stack Developer';
    return this.careerGoal.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  }

  get filteredSkills(): SkillGapItem[] {
    if (this.activeTab === 'critical') return this.criticalSkills;
    if (this.activeTab === 'improve') return this.improveSkills;
    if (this.activeTab === 'strong') return this.strongSkills;
    return this.skillGaps;
  }

  get strongSkills(): SkillGapItem[] {
    return this.skillGaps.filter(s => s.severity === 'EXCELLENT' || s.severity === 'GOOD' || s.gapLevel <= 1);
  }

  get improveSkills(): SkillGapItem[] {
    return this.skillGaps.filter(s => s.severity === 'MODERATE' || s.gapLevel === 2);
  }

  get criticalSkills(): SkillGapItem[] {
    return this.skillGaps.filter(s => s.severity === 'CRITICAL' || s.gapLevel >= 3);
  }

  public getStatusBadge(severity: string): string {
    const s = (severity || '').toUpperCase();
    if (s === 'EXCELLENT' || s === 'GOOD' || s === 'STRONG') return 'badge-success';
    if (s === 'MODERATE' || s === 'NEEDS IMPROVEMENT') return 'badge-warning';
    return 'badge-danger';
  }

  public getBarClass(severity: string): string {
    const s = (severity || '').toUpperCase();
    if (s === 'EXCELLENT' || s === 'GOOD' || s === 'STRONG') return 'progress-bar-success';
    if (s === 'MODERATE' || s === 'NEEDS IMPROVEMENT') return 'progress-bar-warning';
    return 'progress-bar-danger';
  }

  public getGapTextColor(gapLevel: number): string {
    if (gapLevel >= 3) return 'text-danger';
    if (gapLevel >= 2) return 'text-warning';
    return 'text-success';
  }
}
