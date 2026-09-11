import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CareerService } from '../../../core/services/career.service';
import { StudentService } from '../../../core/services/student.service';
import { RoadmapService } from '../../../core/services/roadmap.service';
import { CareerGoal } from '../../../core/models';

@Component({
  selector: 'app-career-goal-setup',
  template: `
    <div class="onboarding-page container">
      <div class="onboarding-card glass-card">
        <!-- Progress Stepper Header -->
        <div class="stepper-header">
          <div class="step-indicator completed">
            <span class="step-num">✓</span>
            <span class="step-title">Profile</span>
          </div>
          <div class="step-line active"></div>
          <div class="step-indicator completed">
            <span class="step-num">✓</span>
            <span class="step-title">Skills</span>
          </div>
          <div class="step-line active"></div>
          <div class="step-indicator active">
            <span class="step-num">3</span>
            <span class="step-title">Career Goal</span>
          </div>
        </div>

        <div class="onboarding-title-area text-center">
          <h2>Choose Your Career Goal</h2>
          <p class="text-secondary">Select your target engineering role to unlock tailored gap analysis and roadmap.</p>
        </div>

        <!-- 10 Career Cards Grid -->
        <div class="career-cards-grid grid-2">
          <div
            class="career-card glass-card glass-card-interactive"
            *ngFor="let goal of careerGoals"
            [class.selected]="selectedGoal?.id === goal.id"
            (click)="selectGoal(goal)"
          >
            <div class="card-radio-indicator">
              <span class="radio-dot" *ngIf="selectedGoal?.id === goal.id"></span>
            </div>
            <div class="career-card-content">
              <div class="career-title-row">
                <h3>{{ goal.title }}</h3>
                <span class="badge" [ngClass]="getDemandBadge(goal.demandLevel)">
                  {{ goal.demandLevel }} Demand
                </span>
              </div>
              <p class="career-desc text-secondary">{{ goal.description }}</p>

              <div class="skills-preview">
                <span class="skills-label text-xs font-semibold text-muted">Core Tech:</span>
                <div class="preview-tags">
                  <span class="badge badge-primary" *ngFor="let s of goal.requiredSkills.slice(0, 4)">{{ s }}</span>
                  <span class="badge badge-info" *ngIf="goal.requiredSkills.length > 4">+{{ goal.requiredSkills.length - 4 }} more</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Required Skills Drawer when Selected -->
        <div class="required-skills-preview glass-card" *ngIf="selectedGoal">
          <div class="preview-header">
            <div>
              <span class="badge badge-cyan">Selected Target Track</span>
              <h3 style="margin-top: 0.35rem;">Required Skills for {{ selectedGoal.title }}</h3>
            </div>
            <span class="text-sm font-semibold text-primary">{{ selectedGoal.requiredSkills.length }} Skills Required</span>
          </div>

          <div class="skills-pill-cloud">
            <span
              class="required-pill"
              *ngFor="let skill of selectedGoal.requiredSkills"
              [class.matched]="isSkillMatched(skill)"
            >
              <span class="pill-status">{{ isSkillMatched(skill) ? '✓' : '○' }}</span>
              <span>{{ skill }}</span>
            </span>
          </div>

          <div class="skills-match-summary">
            <p class="text-sm text-secondary">
              Based on your selected skills, you currently match <strong>{{ getMatchedCount() }}</strong> out of <strong>{{ selectedGoal.requiredSkills.length }}</strong> required competencies for <strong>{{ selectedGoal.title }}</strong>.
            </p>
          </div>
        </div>

        <!-- Actions Footer -->
        <div class="form-actions-footer">
          <a routerLink="/onboarding/skills" class="btn btn-secondary">
            ← Back to Skills
          </a>
          <button type="button" class="btn btn-primary btn-lg" [disabled]="!selectedGoal" (click)="onSetGoal()">
            <span>Set Career Goal & Launch Dashboard</span>
            <app-icon name="arrow-right" [size]="18"></app-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page {
      padding: 3rem 1.5rem 5rem;
      max-width: 1040px;
    }
    .onboarding-card {
      padding: 3rem;
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-xl);
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
    }
    .stepper-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }
    .step-indicator {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      color: var(--text-muted);
    }
    .step-indicator.active {
      color: var(--primary);
      font-weight: 700;
    }
    .step-indicator.completed {
      color: var(--success);
      font-weight: 600;
    }
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #f1f5f9;
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }
    .step-indicator.active .step-num {
      background: var(--gradient-primary);
      color: #fff;
      border-color: transparent;
      box-shadow: 0 0 12px rgba(79, 70, 229, 0.4);
    }
    .step-indicator.completed .step-num {
      background: #ecfdf5;
      color: var(--success);
      border-color: var(--success);
    }
    .step-line {
      width: 48px;
      height: 2px;
      background: #e2e8f0;
    }
    .step-line.active {
      background: var(--primary);
    }
    .onboarding-title-area {
      margin-bottom: 2.5rem;
    }
    .onboarding-title-area h2 {
      font-size: 1.85rem;
      margin-bottom: 0.35rem;
      color: #0f172a;
    }

    /* Career Cards */
    .career-cards-grid {
      gap: 1.25rem;
      margin-bottom: 2.5rem;
    }
    .career-card {
      padding: 1.5rem;
      background: #ffffff;
      cursor: pointer;
      display: flex;
      gap: 1.25rem;
      position: relative;
      border: 1.5px solid #e2e8f0;
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }
    .career-card:hover {
      border-color: #94a3b8;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06);
    }
    .career-card.selected {
      border-color: var(--primary);
      background: #f8faff;
      box-shadow: 0 0 0 1px var(--primary), 0 4px 16px rgba(79, 70, 229, 0.12);
    }
    .card-radio-indicator {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
      background: #fff;
    }
    .career-card.selected .card-radio-indicator {
      border-color: var(--primary);
    }
    .radio-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--primary);
    }
    .career-card-content {
      flex: 1;
    }
    .career-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .career-title-row h3 {
      font-size: 1.1rem;
      color: #0f172a;
    }
    .career-desc {
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1rem;
      color: #475569;
    }
    .skills-preview {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .preview-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    /* Required skills preview box */
    .required-skills-preview {
      padding: 1.75rem;
      background: #f8fafc;
      border: 1px solid #c7d2fe;
      border-radius: var(--radius-lg);
      margin-bottom: 2.5rem;
    }
    .preview-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .skills-pill-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin-bottom: 1.25rem;
    }
    .required-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
    }
    .required-pill.matched {
      background: #ecfdf5;
      border-color: #6ee7b7;
      color: #065f46;
      font-weight: 600;
    }
    .pill-status {
      font-weight: bold;
    }

    .form-actions-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .onboarding-card { padding: 1.75rem; }
      .career-cards-grid { grid-template-columns: 1fr; }
      .stepper-header { gap: 0.5rem; }
      .step-line { width: 20px; }
      .step-title { display: none; }
    }
  `]
})
export class CareerGoalSetupComponent implements OnInit {
  public careerGoals: CareerGoal[] = [];
  public selectedGoal: CareerGoal | null = null;
  public studentSkillNames: string[] = [];

  constructor(
    private careerService: CareerService,
    private studentService: StudentService,
    private roadmapService: RoadmapService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.studentSkillNames = this.studentService.currentSkills.map(s => s.name.toLowerCase());
    const currentGoalTitle = this.studentService.currentProfile?.careerGoal || '';

    this.careerService.getCareerGoals().subscribe(goals => {
      this.careerGoals = goals;
      
      // Match current profile goal first
      const existingMatch = goals.find(g => g.title.toLowerCase() === currentGoalTitle.toLowerCase());
      if (existingMatch) {
        this.selectedGoal = existingMatch;
      } else if (goals.length > 0) {
        // Otherwise pick the goal with highest matching skills
        let bestGoal = goals[0];
        let bestCount = -1;
        goals.forEach(g => {
          const matched = g.requiredSkills.filter(s => this.isSkillMatched(s)).length;
          if (matched > bestCount) {
            bestCount = matched;
            bestGoal = g;
          }
        });
        this.selectedGoal = bestGoal;
      }
    });
  }

  public selectGoal(goal: CareerGoal): void {
    this.selectedGoal = goal;
  }

  public isSkillMatched(skillName: string): boolean {
    const sLower = skillName.toLowerCase();
    return this.studentSkillNames.some(studentSkill =>
      sLower.includes(studentSkill) || studentSkill.includes(sLower)
    );
  }

  public getMatchedCount(): number {
    if (!this.selectedGoal) return 0;
    return this.selectedGoal.requiredSkills.filter(s => this.isSkillMatched(s)).length;
  }

  public getDemandBadge(demand: string): string {
    if (demand === 'Very High') return 'badge-danger';
    if (demand === 'High') return 'badge-success';
    return 'badge-info';
  }

  public onSetGoal(): void {
    if (this.selectedGoal) {
      this.studentService.setCareerGoal(this.selectedGoal.title);
      this.roadmapService.loadRoadmapForGoal(this.selectedGoal.title);
      this.router.navigate(['/dashboard']);
    }
  }
}
