import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  template: `
    <div class="about-page container">
      <div class="page-hero text-center">
        <span class="badge badge-primary">Our Mission</span>
        <h1>Bridging the Student-to-Industry Gap</h1>
        <p class="hero-desc">
          CareerAI was founded with a singular conviction: engineering students shouldn't have to guess what companies actually look for in modern developers.
        </p>
      </div>

      <!-- Problem vs Solution -->
      <div class="comparison-grid grid-2">
        <div class="comp-box glass-card problem">
          <div class="box-icon">
            <app-icon name="alert-triangle" [size]="24" class="text-danger"></app-icon>
          </div>
          <h3>The Student Dilemma</h3>
          <p>Colleges teach broad theory—algorithms, compiler design, and abstract databases—often leaving students unprepared for modern production ecosystems like Spring Boot microservices, Angular reactive state, Docker, and AWS.</p>
          <ul class="dilemma-list">
            <li>No clear understanding of their true market readiness.</li>
            <li>Random tutorials without structured milestone roadmaps.</li>
            <li>Resumes that get rejected by ATS filters within seconds.</li>
          </ul>
        </div>

        <div class="comp-box glass-card solution">
          <div class="box-icon">
            <app-icon name="check-circle" [size]="24" class="text-success"></app-icon>
          </div>
          <h3>The CareerAI Solution</h3>
          <p>We convert abstract job market requirements into actionable, measurable metrics. By cross-referencing your actual technical skills against real job descriptions, we reveal exact gaps and build a personalized path to close them.</p>
          <ul class="solution-list">
            <li>Transparent skill gap calculations (e.g. Spring Boot 45% → 80%).</li>
            <li>Personalized 9-stage career roadmap with interactive trackers.</li>
            <li>Curated portfolio projects that validate real-world engineering depth.</li>
          </ul>
        </div>
      </div>

      <!-- Core Values -->
      <div class="values-section">
        <div class="text-center section-header">
          <span class="badge badge-cyan">Guiding Principles</span>
          <h2>How We Build for Students</h2>
        </div>

        <div class="grid-3">
          <div class="value-card glass-card">
            <h4>1. Transparency First</h4>
            <p>No vague career advice. We provide cold, hard data: percentages, required competencies, and missing keywords.</p>
          </div>
          <div class="value-card glass-card">
            <h4>2. Project-Driven Mastery</h4>
            <p>True learning happens when you write code, containerize backends, and debug reactive state—not just watching videos.</p>
          </div>
          <div class="value-card glass-card">
            <h4>3. AI as an Accessible Mentor</h4>
            <p>Every student deserves access to a Senior Staff Engineer's perspective on architecture, interviews, and code reviews.</p>
          </div>
        </div>
      </div>

      <!-- Impact Stats -->
      <div class="impact-banner glass-card text-center">
        <div class="grid-4">
          <div class="impact-item">
            <span class="impact-num text-gradient">12,000+</span>
            <span class="impact-lbl">Students Guided</span>
          </div>
          <div class="impact-item">
            <span class="impact-num text-gradient">84%</span>
            <span class="impact-lbl">Placement Readiness</span>
          </div>
          <div class="impact-item">
            <span class="impact-num text-gradient">10</span>
            <span class="impact-lbl">Career Tracks</span>
          </div>
          <div class="impact-item">
            <span class="impact-num text-gradient">350+</span>
            <span class="impact-lbl">Colleges Represented</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
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

    .comparison-grid {
      margin-bottom: 5rem;
    }
    .comp-box {
      padding: 2.5rem 2rem;
    }
    .box-icon {
      margin-bottom: 1rem;
    }
    .comp-box h3 {
      font-size: 1.35rem;
      margin-bottom: 0.85rem;
    }
    .comp-box p {
      color: var(--text-secondary);
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    ul li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .dilemma-list li::before {
      content: '✕';
      position: absolute;
      left: 0;
      color: var(--danger);
      font-weight: bold;
    }
    .solution-list li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success);
      font-weight: bold;
    }

    .values-section {
      margin-bottom: 5rem;
    }
    .section-header {
      margin-bottom: 3rem;
    }
    .section-header h2 {
      font-size: 2rem;
      margin-top: 0.5rem;
    }
    .value-card {
      padding: 2rem;
    }
    .value-card h4 {
      font-size: 1.15rem;
      margin-bottom: 0.75rem;
    }
    .value-card p {
      color: var(--text-secondary);
      font-size: 0.925rem;
      line-height: 1.6;
    }

    .impact-banner {
      padding: 3rem 2rem;
      background: var(--bg-surface);
      border: 1px solid rgba(99, 102, 241, 0.2);
    }
    .impact-num {
      font-size: 2.5rem;
      font-weight: 800;
      display: block;
      line-height: 1.1;
      margin-bottom: 0.35rem;
    }
    .impact-lbl {
      color: var(--text-muted);
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    @media (max-width: 768px) {
      .page-hero h1 { font-size: 2rem; }
    }
  `]
})
export class AboutComponent {}
