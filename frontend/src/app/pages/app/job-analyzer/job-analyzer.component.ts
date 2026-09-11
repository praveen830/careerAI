import { Component, OnInit } from '@angular/core';
import { JobAnalyzerService } from '../../../core/services/job-analyzer.service';
import { JobMatchResult } from '../../../core/models';

@Component({
  selector: 'app-job-analyzer',
  template: `
    <div class="job-analyzer-page">
      <!-- Header -->
      <section class="analyzer-header glass-card">
        <div>
          <span class="badge badge-primary">Recruiter Simulation</span>
          <h1>Job Description (JD) Skill Matcher</h1>
          <p class="text-secondary">
            Paste any real-world tech job description to see your exact match percentage, matching vs missing skills, and prioritized learning steps.
          </p>
        </div>
      </section>

      <!-- Split Screen Interface -->
      <div class="split-screen-container">
        <!-- LEFT: Job Description Input -->
        <div class="screen-half left-panel glass-card">
          <div class="panel-top">
            <div class="title-with-pill">
              <h3>Job Description</h3>
              <span class="badge badge-info">Input Text</span>
            </div>
            <div class="sample-pills">
              <span class="text-xs text-muted">Try sample role:</span>
              <button
                type="button"
                class="sample-btn"
                *ngFor="let sample of sampleJobs; let i = index"
                (click)="loadSample(i)"
              >
                {{ sample.title }}
              </button>
            </div>
          </div>

          <div class="textarea-wrapper">
            <textarea
              class="form-control jd-textarea"
              rows="16"
              [(ngModel)]="jdInputText"
              placeholder="Paste job description requirements, responsibilities, and required qualifications here..."
            ></textarea>
          </div>

          <div class="panel-bottom-actions">
            <button
              class="btn btn-primary btn-lg"
              (click)="onAnalyzeJob()"
              [disabled]="isAnalyzing || !jdInputText.trim()"
            >
              <app-icon name="search" [size]="18"></app-icon>
              <span *ngIf="!isAnalyzing">Analyze Job Fit</span>
              <span *ngIf="isAnalyzing">Parsing Job Requirements...</span>
            </button>
            <button class="btn btn-ghost btn-sm" (click)="clearText()">Clear Text</button>
          </div>
        </div>

        <!-- RIGHT: Job Match Output -->
        <div class="screen-half right-panel glass-card" *ngIf="matchResult">
          <div class="panel-top">
            <h3>Job Match Analysis</h3>
            <span class="badge badge-success">✓ Analysis Ready</span>
          </div>

          <!-- Score Card -->
          <div class="match-score-row glass-card">
            <app-circular-progress
              [value]="matchResult.matchPercentage"
              [size]="100"
              [strokeWidth]="9"
              colorClass="primary"
            ></app-circular-progress>
            <div class="score-meta">
              <span class="text-xs text-muted uppercase">OVERALL CANDIDATE FIT</span>
              <h2 class="match-pct text-gradient">{{ matchResult.matchPercentage }}% Match</h2>
              <p class="text-xs text-secondary">
                {{ matchResult.matchPercentage >= 70 ? 'Strong candidate fit. Recommended to apply!' : 'Moderate fit. Close 2 missing skills before applying.' }}
              </p>
            </div>
          </div>

          <!-- Matching vs Missing Skills -->
          <div class="skills-split-box grid-2">
            <!-- Matching Skills -->
            <div class="match-sub-box glass-card">
              <div class="sub-box-header">
                <span class="badge badge-success">✓ Matching Skills</span>
                <span class="text-xs font-bold">{{ matchResult.matchingSkills.length }} detected</span>
              </div>
              <div class="tags-cloud">
                <span class="badge badge-success" *ngFor="let s of matchResult.matchingSkills">
                  ✓ {{ s }}
                </span>
              </div>
            </div>

            <!-- Missing Skills -->
            <div class="match-sub-box glass-card">
              <div class="sub-box-header">
                <span class="badge badge-danger">⚠ Missing Skills</span>
                <span class="text-xs font-bold text-danger">{{ matchResult.missingSkills.length }} missing</span>
              </div>
              <div class="tags-cloud">
                <span class="badge badge-danger" *ngFor="let s of matchResult.missingSkills">
                  ⚠ {{ s }}
                </span>
              </div>
            </div>
          </div>

          <!-- Prioritized Recommended Learning -->
          <div class="recommended-learning-box glass-card">
            <h4>Prioritized Learning Steps For This Role</h4>
            <div class="learning-steps-list">
              <div class="step-item" *ngFor="let step of matchResult.recommendedLearning">
                <div class="step-badge">{{ step.priority }}</div>
                <div class="step-text">
                  <span class="step-title font-semibold">{{ step.title }}</span>
                  <p class="step-desc text-xs text-secondary">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Action CTA -->
          <div class="right-panel-footer">
            <a routerLink="/roadmap" class="btn btn-primary btn-sm">
              Add Missing Skills to Roadmap →
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .job-analyzer-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1320px;
      margin: 0 auto;
    }
    .analyzer-header {
      padding: 2rem 2.5rem;
    }
    .analyzer-header h1 {
      font-size: 1.85rem;
      margin: 0.5rem 0 0.35rem;
    }

    /* Split Screen Layout */
    .split-screen-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      align-items: stretch;
    }
    .screen-half {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .panel-top {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .title-with-pill {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sample-pills {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .sample-btn {
      font-size: 0.75rem;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      background: var(--bg-surface-elevated);
      color: var(--primary);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .sample-btn:hover {
      background: var(--primary);
      color: #fff;
    }
    .textarea-wrapper {
      flex: 1;
    }
    .jd-textarea {
      height: 100%;
      min-height: 380px;
      resize: vertical;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .panel-bottom-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    /* Right Panel Result */
    .match-score-row {
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: var(--bg-surface-elevated);
    }
    .match-pct {
      font-size: 1.85rem;
      font-weight: 800;
      line-height: 1.1;
      margin: 0.25rem 0;
    }
    .skills-split-box {
      gap: 1rem;
    }
    .match-sub-box {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: var(--bg-surface-elevated);
    }
    .sub-box-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .tags-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .recommended-learning-box {
      padding: 1.5rem;
      background: var(--bg-surface-elevated);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .learning-steps-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
    }
    .step-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--primary);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .step-title {
      font-size: 0.9rem;
    }
    .right-panel-footer {
      margin-top: auto;
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 960px) {
      .split-screen-container { grid-template-columns: 1fr; }
    }
  `]
})
export class JobAnalyzerComponent implements OnInit {
  public jdInputText: string = '';
  public isAnalyzing: boolean = false;
  public matchResult: JobMatchResult | null = null;
  public sampleJobs: { title: string; text: string }[] = [];

  constructor(private jobAnalyzerService: JobAnalyzerService) {}

  ngOnInit(): void {
    this.sampleJobs = this.jobAnalyzerService.sampleJDs;
    // Preload first sample job
    this.loadSample(0);
  }

  public loadSample(index: number): void {
    if (this.sampleJobs[index]) {
      this.jdInputText = this.sampleJobs[index].text;
      this.onAnalyzeJob();
    }
  }

  public clearText(): void {
    this.jdInputText = '';
    this.matchResult = null;
  }

  public onAnalyzeJob(): void {
    if (!this.jdInputText.trim()) return;

    this.isAnalyzing = true;
    this.jobAnalyzerService.analyzeJobDescription(this.jdInputText).subscribe(res => {
      this.matchResult = res;
      this.isAnalyzing = false;
    });
  }
}
