import { Component } from '@angular/core';

@Component({
  selector: 'app-features',
  template: `
    <div class="features-page container">
      <div class="page-hero text-center">
        <span class="badge badge-primary">Platform Capabilities</span>
        <h1>Built for Every Stage of Your Career Journey</h1>
        <p class="hero-desc">
          Explore the comprehensive suite of analysis tools, personalized roadmaps, and career intelligence designed to make you hireable.
        </p>
      </div>

      <!-- Feature Detail Sections -->
      <div class="feature-rows">
        <!-- Feature 1: Skill Gap -->
        <div class="feature-row glass-card">
          <div class="feature-text">
            <span class="badge badge-danger">Algorithmic Match</span>
            <h2>Skill Gap Analysis</h2>
            <p>Know exactly where you stand against real industry benchmarks. Our analyzer assesses your current technical competencies against 10 modern job tracks and flags high-priority gaps.</p>
            <ul class="feature-checklist">
              <li>Visual percentage comparison (Current vs Target Requirement).</li>
              <li>Triage into Strong, Needs Improvement, and Critical Gaps.</li>
              <li>One-click roadmap alignment to start closing gaps immediately.</li>
            </ul>
            <a routerLink="/skill-gap" class="btn btn-primary btn-sm">Explore Skill Gap →</a>
          </div>
          <div class="feature-visual">
            <div class="mock-gap-card glass-card">
              <div class="mock-row">
                <span class="font-semibold">Spring Boot</span>
                <span class="badge badge-danger">45% / 80% (35% Gap)</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill progress-bar-danger" style="width: 45%;"></div>
              </div>

              <div class="mock-row" style="margin-top: 1.5rem;">
                <span class="font-semibold">Docker</span>
                <span class="badge badge-danger">25% / 60% (35% Gap)</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill progress-bar-danger" style="width: 25%;"></div>
              </div>

              <div class="mock-row" style="margin-top: 1.5rem;">
                <span class="font-semibold">Java Core & OOP</span>
                <span class="badge badge-success">75% / 85% (10% Gap)</span>
              </div>
              <div class="progress-bar-container">
                <div class="progress-bar-fill progress-bar-success" style="width: 75%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature 2: Personalized Roadmap -->
        <div class="feature-row glass-card reverse">
          <div class="feature-text">
            <span class="badge badge-cyan">Structured Guidance</span>
            <h2>Personalized Career Roadmap</h2>
            <p>Stop drowning in endless tutorial playlists. Follow a curated, sequential roadmap divided into logical stages—from fundamentals to cloud deployment.</p>
            <ul class="feature-checklist">
              <li>9 structured stages with estimated hours per milestone.</li>
              <li>Granular topic checklists that automatically update your progress.</li>
              <li>Stage status badges (Completed, In Progress, Upcoming).</li>
            </ul>
            <a routerLink="/roadmap" class="btn btn-secondary btn-sm">View Roadmap →</a>
          </div>
          <div class="feature-visual">
            <div class="mock-roadmap-card glass-card">
              <div class="roadmap-item done">
                <span class="circle-check">✓</span>
                <div>
                  <h4>Stage 1: Java Fundamentals</h4>
                  <span class="text-xs text-muted">Completed • 30 hrs</span>
                </div>
              </div>
              <div class="roadmap-item active">
                <span class="circle-dot">→</span>
                <div>
                  <h4>Stage 3: Advanced Java & Streams</h4>
                  <span class="text-xs text-cyan">In Progress • 35 hrs</span>
                </div>
              </div>
              <div class="roadmap-item pending">
                <span class="circle-empty">○</span>
                <div>
                  <h4>Stage 4: Spring Boot & Data JPA</h4>
                  <span class="text-xs text-muted">Upcoming • 50 hrs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Feature 3: Resume ATS & Job Analyzer -->
        <div class="feature-row glass-card">
          <div class="feature-text">
            <span class="badge badge-primary">Hiring AI</span>
            <h2>Resume ATS & Job Analyzer</h2>
            <p>Get your resume past company applicant tracking systems and understand if you are a good match for specific job postings before you apply.</p>
            <ul class="feature-checklist">
              <li>Instant resume scoring out of 100 with category breakdowns.</li>
              <li>Identifies high-impact missing keywords like Docker, AWS, and Microservices.</li>
              <li>Split-screen JD analyzer that parses requirements and gives targeted recommendations.</li>
            </ul>
            <div style="display: flex; gap: 0.75rem;">
              <a routerLink="/resume" class="btn btn-primary btn-sm">Resume Analyzer</a>
              <a routerLink="/job-analyzer" class="btn btn-secondary btn-sm">Job Analyzer</a>
            </div>
          </div>
          <div class="feature-visual">
            <div class="mock-ats-card glass-card">
              <div class="ats-score-row">
                <app-circular-progress [value]="78" [size]="80" [strokeWidth]="8" colorClass="primary"></app-circular-progress>
                <div>
                  <h4>Resume Score: 78/100</h4>
                  <p class="text-xs text-muted">ATS Compatibility: Strong</p>
                </div>
              </div>
              <div class="ats-tags">
                <span class="badge badge-success">✓ Clean Layout</span>
                <span class="badge badge-success">✓ Strong Java</span>
                <span class="badge badge-warning">⚠ Add Docker Keywords</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .features-page {
      padding: 4rem 1.5rem;
    }
    .page-hero {
      max-width: 760px;
      margin: 0 auto 4rem;
    }
    .page-hero h1 {
      font-size: 2.75rem;
      margin: 1rem 0;
    }
    .hero-desc {
      color: var(--text-secondary);
      font-size: 1.15rem;
      line-height: 1.6;
    }
    .text-center { text-align: center; }

    .feature-rows {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .feature-row {
      padding: 3rem;
      display: flex;
      align-items: center;
      gap: 3.5rem;
    }
    .feature-row.reverse {
      flex-direction: row-reverse;
    }
    .feature-text {
      flex: 1;
    }
    .feature-text h2 {
      font-size: 2rem;
      margin: 0.75rem 0 1rem;
    }
    .feature-text p {
      color: var(--text-secondary);
      font-size: 1.05rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .feature-checklist {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
    .feature-checklist li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .feature-checklist li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: bold;
    }
    .feature-visual {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .mock-gap-card, .mock-roadmap-card, .mock-ats-card {
      width: 100%;
      max-width: 440px;
      padding: 1.75rem;
      background: var(--bg-surface-elevated);
    }
    .mock-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    .roadmap-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.85rem;
      border-radius: var(--radius-md);
      margin-bottom: 0.65rem;
      background: var(--bg-surface);
    }
    .roadmap-item.active {
      border: 1px solid var(--accent-cyan);
    }
    .circle-check {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--success-light);
      color: var(--success);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }
    .circle-dot {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--accent-cyan-light);
      color: var(--accent-cyan);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
    }
    .circle-empty {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px dashed var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .ats-score-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .ats-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    @media (max-width: 960px) {
      .feature-row, .feature-row.reverse {
        flex-direction: column;
        padding: 2rem;
        gap: 2rem;
      }
    }
  `]
})
export class FeaturesComponent {}
