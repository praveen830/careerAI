import { Component, OnInit } from '@angular/core';
import { ResumeService } from '../../../core/services/resume.service';
import { ResumeAnalysisResult } from '../../../core/models';

@Component({
  selector: 'app-resume',
  template: `
    <div class="resume-page">
      <!-- Header Banner -->
      <section class="resume-header glass-card">
        <div>
          <span class="badge badge-primary">ATS Intelligence</span>
          <h1>Resume Scanner & ATS Optimizer</h1>
          <p class="text-secondary">
            Upload your student resume (PDF or DOCX) to simulate recruiter applicant tracking systems and uncover missing keywords.
          </p>
        </div>
      </section>

      <!-- Upload Zone -->
      <section class="upload-section">
        <div
          class="drop-zone glass-card"
          [class.drag-over]="isDragging"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <div class="drop-icon-wrap">
            <app-icon name="upload-cloud" [size]="42" class="text-primary"></app-icon>
          </div>

          <div class="drop-text-group">
            <h3>Drag & Drop Resume Here</h3>
            <p class="text-secondary text-sm">Supported formats: <strong>PDF / DOCX</strong> (Max 5MB)</p>
          </div>

          <div class="drop-actions">
            <input
              type="file"
              id="resumeFileInput"
              style="display: none;"
              accept=".pdf,.docx,.doc"
              (change)="onFileSelected($event)"
            />
            <label for="resumeFileInput" class="btn btn-primary">
              <app-icon name="file-text" [size]="16"></app-icon>
              <span>Upload Resume</span>
            </label>

            <button type="button" class="btn btn-secondary" (click)="loadSampleResume()">
              ⚡ Test With Praveen's Sample Resume
            </button>
          </div>

          <div class="upload-status" *ngIf="isAnalyzing">
            <div class="spinner-ring"></div>
            <span class="text-sm font-semibold">Simulating ATS Parsing & Keyword Extraction...</span>
          </div>

          <div class="file-name-badge" *ngIf="uploadedFileName && !isAnalyzing">
            <span class="badge badge-success">✓ Loaded: {{ uploadedFileName }}</span>
          </div>
        </div>
      </section>

      <!-- Analysis Results -->
      <section class="results-section" *ngIf="analysisResult && !isAnalyzing">
        <!-- Score Overview & Categories -->
        <div class="score-overview-grid grid-2">
          <!-- Big Score Ring -->
          <div class="score-main-card glass-card text-center">
            <span class="badge badge-primary">Overall ATS Score</span>
            <div class="gauge-wrap" style="margin: 1.5rem 0 1rem;">
              <app-circular-progress
                [value]="analysisResult.score"
                [size]="160"
                [strokeWidth]="12"
                label="Score"
                colorClass="primary"
              ></app-circular-progress>
            </div>
            <h3 class="score-verdict">
              <span class="text-gradient">{{ analysisResult.score }} / 100</span> — Strong Candidate
            </h3>
            <p class="text-secondary text-xs">
              Your resume will pass the initial screen at 82% of mid-size tech employers.
            </p>
          </div>

          <!-- Category Bars -->
          <div class="categories-card glass-card">
            <h3>Category Breakdown</h3>
            <div class="cat-bars-list">
              <div class="cat-bar-item">
                <div class="cat-bar-labels">
                  <span class="font-semibold text-sm">Skills Section</span>
                  <span class="text-xs font-bold">{{ analysisResult.categories.skills }}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill progress-bar-primary" [style.width.%]="analysisResult.categories.skills"></div>
                </div>
              </div>

              <div class="cat-bar-item">
                <div class="cat-bar-labels">
                  <span class="font-semibold text-sm">Projects Quality</span>
                  <span class="text-xs font-bold">{{ analysisResult.categories.projects }}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill progress-bar-primary" [style.width.%]="analysisResult.categories.projects"></div>
                </div>
              </div>

              <div class="cat-bar-item">
                <div class="cat-bar-labels">
                  <span class="font-semibold text-sm">Formatting & Layout</span>
                  <span class="text-xs font-bold">{{ analysisResult.categories.formatting }}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill progress-bar-success" [style.width.%]="analysisResult.categories.formatting"></div>
                </div>
              </div>

              <div class="cat-bar-item">
                <div class="cat-bar-labels">
                  <span class="font-semibold text-sm">ATS Keyword Density</span>
                  <span class="text-xs font-bold text-danger">{{ analysisResult.categories.keywords }}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill progress-bar-danger" [style.width.%]="analysisResult.categories.keywords"></div>
                </div>
              </div>

              <div class="cat-bar-item">
                <div class="cat-bar-labels">
                  <span class="font-semibold text-sm">Work / Internship Experience</span>
                  <span class="text-xs font-bold">{{ analysisResult.categories.experience }}%</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar-fill progress-bar-warning" [style.width.%]="analysisResult.categories.experience"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Strengths vs Suggestions -->
        <div class="feedback-grid grid-2">
          <!-- Strengths -->
          <div class="feedback-box glass-card">
            <div class="feedback-header">
              <span class="badge badge-success">✓ Strengths</span>
              <h4>What You Did Well</h4>
            </div>
            <ul class="feedback-list strengths">
              <li *ngFor="let st of analysisResult.strengths">
                {{ st }}
              </li>
            </ul>
          </div>

          <!-- Suggestions -->
          <div class="feedback-box glass-card">
            <div class="feedback-header">
              <span class="badge badge-warning">⚠ Suggestions</span>
              <h4>High-Impact Improvements</h4>
            </div>
            <ul class="feedback-list suggestions">
              <li *ngFor="let sg of analysisResult.suggestions">
                {{ sg }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Keyword Scanner -->
        <div class="keywords-scanner-box glass-card">
          <div class="scanner-header">
            <h3>ATS Keyword Scanner</h3>
            <p class="text-xs text-muted">Detected keywords in your file vs high-frequency recruiter search filters</p>
          </div>

          <div class="keywords-two-columns grid-2">
            <div class="keyword-sub-col">
              <span class="text-xs font-semibold text-success">FOUND KEYWORDS ({{ analysisResult.foundKeywords.length }}):</span>
              <div class="keyword-tags">
                <span class="badge badge-success" *ngFor="let kw of analysisResult.foundKeywords">✓ {{ kw }}</span>
              </div>
            </div>

            <div class="keyword-sub-col">
              <span class="text-xs font-semibold text-danger">CRITICAL MISSING KEYWORDS ({{ analysisResult.missingKeywords.length }}):</span>
              <div class="keyword-tags">
                <span class="badge badge-danger" *ngFor="let kw of analysisResult.missingKeywords">⚠ {{ kw }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .resume-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
    .resume-header {
      padding: 2rem 2.5rem;
    }
    .resume-header h1 {
      font-size: 1.85rem;
      margin: 0.5rem 0 0.35rem;
    }

    /* Drop Zone */
    .drop-zone {
      padding: 3.5rem 2rem;
      border: 2px dashed var(--border-color);
      border-radius: var(--radius-xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.25rem;
      transition: all var(--transition-normal);
      background: var(--bg-surface);
    }
    .drop-zone.drag-over {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.05);
      transform: scale(1.01);
    }
    .drop-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .drop-text-group h3 {
      font-size: 1.35rem;
      margin-bottom: 0.25rem;
    }
    .drop-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
    }
    .upload-status {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 1rem;
      color: var(--accent-cyan);
    }
    .spinner-ring {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(6, 182, 212, 0.2);
      border-top-color: var(--accent-cyan);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Results */
    .results-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      animation: fadeIn 0.4s ease-out;
    }
    .score-main-card, .categories-card, .feedback-box, .keywords-scanner-box {
      padding: 2rem;
    }
    .score-verdict {
      font-size: 1.35rem;
      margin-bottom: 0.35rem;
    }
    .cat-bars-list {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      margin-top: 1.25rem;
    }
    .cat-bar-item {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .cat-bar-labels {
      display: flex;
      justify-content: space-between;
    }
    .feedback-header {
      margin-bottom: 1.25rem;
    }
    .feedback-header h4 {
      font-size: 1.15rem;
      margin-top: 0.5rem;
    }
    .feedback-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .feedback-list li {
      position: relative;
      padding-left: 1.6rem;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .feedback-list.strengths li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success);
      font-weight: bold;
    }
    .feedback-list.suggestions li::before {
      content: '⚠';
      position: absolute;
      left: 0;
      color: var(--warning);
      font-weight: bold;
    }
    .keywords-scanner-box h3 {
      font-size: 1.25rem;
    }
    .keywords-two-columns {
      margin-top: 1.25rem;
      gap: 2rem;
    }
    .keyword-sub-col {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .keyword-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.45rem;
    }

    @media (max-width: 768px) {
      .score-overview-grid, .feedback-grid, .keywords-two-columns { grid-template-columns: 1fr; }
      .drop-actions { flex-direction: column; width: 100%; }
      .drop-actions .btn { width: 100%; }
    }
  `]
})
export class ResumeComponent implements OnInit {
  public isDragging: boolean = false;
  public isAnalyzing: boolean = false;
  public uploadedFileName: string | null = null;
  public analysisResult: ResumeAnalysisResult | null = null;

  constructor(private resumeService: ResumeService) {}

  ngOnInit(): void {
    // Pre-load mock result for demonstration
    this.analysisResult = this.resumeService.getMockResult();
    this.uploadedFileName = 'Praveen_Resume_Java_FullStack.pdf';
  }

  public onDragOver(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = true;
  }

  public onDragLeave(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
  }

  public onDrop(e: DragEvent): void {
    e.preventDefault();
    e.stopPropagation();
    this.isDragging = false;
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      this.handleFile(e.dataTransfer.files[0]);
    }
  }

  public onFileSelected(e: any): void {
    if (e.target.files && e.target.files.length > 0) {
      this.handleFile(e.target.files[0]);
    }
  }

  public loadSampleResume(): void {
    this.uploadedFileName = 'Praveen_Resume_Java_FullStack.pdf';
    this.triggerAnalysis('Praveen_Resume_Java_FullStack.pdf');
  }

  private handleFile(file: File): void {
    this.uploadedFileName = file.name;
    this.triggerAnalysis(file.name);
  }

  private triggerAnalysis(fileName: string): void {
    this.isAnalyzing = true;
    this.resumeService.analyzeResume(fileName).subscribe(res => {
      this.analysisResult = res;
      this.isAnalyzing = false;
    });
  }
}
