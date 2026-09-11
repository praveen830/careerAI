import { Component, OnInit } from '@angular/core';
import { StudentService } from '../../../core/services/student.service';
import { RoadmapService } from '../../../core/services/roadmap.service';
import { StudentProfile } from '../../../core/models';

@Component({
  selector: 'app-progress',
  template: `
    <div class="progress-page">
      <!-- Header with Learning Streak -->
      <section class="progress-header glass-card">
        <div class="header-left">
          <span class="badge badge-primary">Student Analytics</span>
          <h1>Career Readiness & Skill Velocity</h1>
          <p class="text-secondary">
            Visualize your weekly study consistency, incremental skill improvements, and roadmap milestone trajectory.
          </p>
        </div>

        <div class="streak-hero-card glass-card">
          <div class="flame-icon">🔥</div>
          <div class="streak-data">
            <span class="streak-days font-bold">{{ profile.streakDays }} Day Streak!</span>
            <span class="text-xs text-muted">Daily engineering practice</span>
          </div>

          <!-- Weekly Days Checkins -->
          <div class="streak-week-dots">
            <div class="day-dot active" title="Mon: 2.5 hrs"><span>M</span></div>
            <div class="day-dot active" title="Tue: 3.0 hrs"><span>T</span></div>
            <div class="day-dot active" title="Wed: 1.5 hrs"><span>W</span></div>
            <div class="day-dot active" title="Thu: 4.0 hrs"><span>T</span></div>
            <div class="day-dot active" title="Fri: 2.0 hrs"><span>F</span></div>
            <div class="day-dot active" title="Sat: 5.0 hrs"><span>S</span></div>
            <div class="day-dot active today" title="Sun (Today): Active"><span>S</span></div>
          </div>
        </div>
      </section>

      <!-- Top Velocity Metrics -->
      <section class="velocity-row grid-4">
        <div class="metric-box glass-card">
          <div class="metric-top">
            <span class="text-xs text-muted uppercase">Java Foundation</span>
            <span class="badge badge-success">↑ 10%</span>
          </div>
          <h2 class="metric-val">75%</h2>
          <span class="text-xs text-secondary">Stream API & Lambdas completed</span>
        </div>

        <div class="metric-box glass-card">
          <div class="metric-top">
            <span class="text-xs text-muted uppercase">Spring Boot</span>
            <span class="badge badge-success">↑ 20%</span>
          </div>
          <h2 class="metric-val">45%</h2>
          <span class="text-xs text-secondary">IoC & Starter configuration grasped</span>
        </div>

        <div class="metric-box glass-card">
          <div class="metric-top">
            <span class="text-xs text-muted uppercase">Angular Client</span>
            <span class="badge badge-success">↑ 8%</span>
          </div>
          <h2 class="metric-val">60%</h2>
          <span class="text-xs text-secondary">Components & Routing masteries</span>
        </div>

        <div class="metric-box glass-card">
          <div class="metric-top">
            <span class="text-xs text-muted uppercase">SQL & Databases</span>
            <span class="badge badge-success">↑ 12%</span>
          </div>
          <h2 class="metric-val">70%</h2>
          <span class="text-xs text-secondary">Complex joins & subqueries practice</span>
        </div>
      </section>

      <!-- Charts Section: Weekly Study Time & Monthly Readiness Velocity -->
      <section class="charts-grid grid-2">
        <!-- Chart 1: Weekly Hours CSS Bar Chart -->
        <div class="chart-card glass-card">
          <div class="chart-header">
            <div>
              <h3>Weekly Study Hours</h3>
              <p class="text-xs text-muted">Total: 18.5 hours recorded this week</p>
            </div>
            <span class="badge badge-cyan">Goal: 20 hrs</span>
          </div>

          <div class="bar-chart-visual">
            <div class="chart-bars">
              <div class="bar-column">
                <div class="bar-fill" style="height: 50%;" title="Mon: 2.5 hrs"></div>
                <span class="bar-label">Mon</span>
              </div>
              <div class="bar-column">
                <div class="bar-fill" style="height: 60%;" title="Tue: 3.0 hrs"></div>
                <span class="bar-label">Tue</span>
              </div>
              <div class="bar-column">
                <div class="bar-fill" style="height: 30%;" title="Wed: 1.5 hrs"></div>
                <span class="bar-label">Wed</span>
              </div>
              <div class="bar-column">
                <div class="bar-fill" style="height: 80%;" title="Thu: 4.0 hrs"></div>
                <span class="bar-label">Thu</span>
              </div>
              <div class="bar-column">
                <div class="bar-fill" style="height: 40%;" title="Fri: 2.0 hrs"></div>
                <span class="bar-label">Fri</span>
              </div>
              <div class="bar-column">
                <div class="bar-fill highlight" style="height: 100%;" title="Sat: 5.0 hrs"></div>
                <span class="bar-label">Sat</span>
              </div>
              <div class="bar-column">
                <div class="bar-fill highlight" style="height: 70%;" title="Sun: 3.5 hrs"></div>
                <span class="bar-label">Sun</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Chart 2: Readiness Growth Trajectory -->
        <div class="chart-card glass-card">
          <div class="chart-header">
            <div>
              <h3>Readiness Trajectory (Month-by-Month)</h3>
              <p class="text-xs text-muted">From 28% (Jan) to 62% (Current)</p>
            </div>
            <span class="badge badge-primary">+34% Net Growth</span>
          </div>

          <div class="trajectory-visual">
            <div class="trajectory-step">
              <div class="traj-circle">28%</div>
              <span class="traj-month">Jan</span>
            </div>
            <div class="traj-connector done"></div>
            <div class="trajectory-step">
              <div class="traj-circle">38%</div>
              <span class="traj-month">Feb</span>
            </div>
            <div class="traj-connector done"></div>
            <div class="trajectory-step">
              <div class="traj-circle">48%</div>
              <span class="traj-month">Mar</span>
            </div>
            <div class="traj-connector done"></div>
            <div class="trajectory-step current">
              <div class="traj-circle text-gradient">62%</div>
              <span class="traj-month font-bold text-primary">Now</span>
            </div>
            <div class="traj-connector pending"></div>
            <div class="trajectory-step target">
              <div class="traj-circle">85%</div>
              <span class="traj-month text-success">Target</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Milestone Progress & Projects -->
      <section class="breakdown-grid grid-2">
        <div class="breakdown-card glass-card">
          <h3>Roadmap Completion Rate</h3>
          <p class="text-xs text-muted" style="margin-bottom: 1.25rem;">38% of total 310 hours curriculum completed</p>

          <div class="stage-pills-list">
            <div class="stage-row done">
              <span class="status-icon">✓</span>
              <span class="font-semibold">Stage 1: Java Fundamentals (100%)</span>
              <span class="badge badge-success">30 hrs</span>
            </div>
            <div class="stage-row done">
              <span class="status-icon">✓</span>
              <span class="font-semibold">Stage 2: OOP & Collections (100%)</span>
              <span class="badge badge-success">45 hrs</span>
            </div>
            <div class="stage-row in-progress">
              <span class="status-icon">→</span>
              <span class="font-semibold text-cyan">Stage 3: Advanced Java (75%)</span>
              <span class="badge badge-cyan">26 / 35 hrs</span>
            </div>
            <div class="stage-row upcoming">
              <span class="status-icon">○</span>
              <span class="font-semibold text-muted">Stage 4: Spring Boot Basics (0%)</span>
              <span class="badge badge-info">50 hrs</span>
            </div>
          </div>
        </div>

        <div class="breakdown-card glass-card">
          <h3>Recent Project Achievements</h3>
          <p class="text-xs text-muted" style="margin-bottom: 1.25rem;">Verified repository submissions & code commits</p>

          <div class="projects-history-list">
            <div class="history-item glass-card">
              <div class="history-icon">📦</div>
              <div class="history-details">
                <span class="font-semibold text-sm">Student Management System</span>
                <span class="text-xs text-secondary">Backend CRUD with Java, Spring Boot & MySQL</span>
              </div>
              <span class="badge badge-success">Completed</span>
            </div>

            <div class="history-item glass-card">
              <div class="history-icon">🛒</div>
              <div class="history-details">
                <span class="font-semibold text-sm">E-Commerce Application</span>
                <span class="text-xs text-secondary">Cart state, JWT login & payment mock</span>
              </div>
              <span class="badge badge-warning">In Progress</span>
            </div>

            <div class="history-item glass-card">
              <div class="history-icon">📄</div>
              <div class="history-details">
                <span class="font-semibold text-sm">Resume ATS Optimization</span>
                <span class="text-xs text-secondary">Scored 78/100 on ATS scanner</span>
              </div>
              <span class="badge badge-primary">Scored</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .progress-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1280px;
      margin: 0 auto;
    }
    .progress-header {
      padding: 2.25rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .progress-header h1 {
      font-size: 1.85rem;
      margin: 0.5rem 0 0.35rem;
    }

    /* Streak Card — Clean Solid Warm Light Card */
    .streak-hero-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.25rem 1.75rem;
      background: linear-gradient(135deg, #ffffff 0%, #fffbeb 50%, #fef3c7 100%);
      border: 1px solid #fde68a;
      border-radius: var(--radius-lg);
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.06);
    }
    .flame-icon {
      font-size: 2.25rem;
    }
    .streak-data {
      display: flex;
      flex-direction: column;
    }
    .streak-days {
      font-size: 1.15rem;
      color: #f59e0b;
    }
    .streak-week-dots {
      display: flex;
      gap: 6px;
      margin-left: 0.5rem;
    }
    .day-dot {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: bold;
      color: var(--text-muted);
      border: 1px solid var(--border-color);
    }
    .day-dot.active {
      background: #f59e0b;
      color: #000;
      border-color: #f59e0b;
    }
    .day-dot.today {
      box-shadow: 0 0 10px #f59e0b;
    }

    /* Velocity Metrics */
    .metric-box {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .metric-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .metric-val {
      font-size: 2rem;
      font-weight: 800;
      margin: 0.2rem 0;
    }

    /* Charts */
    .chart-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .bar-chart-visual {
      height: 200px;
      padding-top: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: flex-end;
    }
    .chart-bars {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
    }
    .bar-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      height: 100%;
      justify-content: flex-end;
      width: 32px;
    }
    .bar-fill {
      width: 100%;
      background: var(--gradient-primary);
      border-radius: 4px 4px 0 0;
      transition: height 0.8s ease;
      cursor: pointer;
    }
    .bar-fill.highlight {
      background: var(--gradient-accent);
      box-shadow: 0 0 12px rgba(6, 182, 212, 0.4);
    }
    .bar-label {
      font-size: 0.75rem;
      color: var(--text-muted);
    }

    /* Trajectory Visual */
    .trajectory-visual {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2.5rem 1rem 1rem;
    }
    .trajectory-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }
    .traj-circle {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.95rem;
    }
    .trajectory-step.current .traj-circle {
      border-color: var(--primary);
      box-shadow: 0 0 20px rgba(99, 102, 241, 0.45);
      background: var(--bg-surface);
    }
    .trajectory-step.target .traj-circle {
      border-color: var(--success);
      color: var(--success);
    }
    .traj-connector {
      flex: 1;
      height: 2px;
      background: var(--border-subtle);
      margin-bottom: 1.25rem;
    }
    .traj-connector.done {
      background: var(--primary);
    }
    .traj-month {
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* Breakdown lists */
    .breakdown-card {
      padding: 2rem;
    }
    .stage-pills-list, .projects-history-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .stage-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.85rem 1rem;
      background: var(--bg-surface-elevated);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
    }
    .status-icon {
      font-weight: bold;
      margin-right: 0.5rem;
    }
    .stage-row.done .status-icon { color: var(--success); }
    .stage-row.in-progress .status-icon { color: var(--accent-cyan); }
    .stage-row.upcoming .status-icon { color: var(--text-muted); }

    .history-item {
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      background: var(--bg-surface-elevated);
    }
    .history-icon {
      font-size: 1.4rem;
    }
    .history-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    @media (max-width: 860px) {
      .progress-header { flex-direction: column; text-align: center; }
      .charts-grid, .breakdown-grid { grid-template-columns: 1fr; }
      .trajectory-visual { overflow-x: auto; }
    }
  `]
})
export class ProgressComponent implements OnInit {
  public profile!: StudentProfile;

  constructor(
    private studentService: StudentService,
    private roadmapService: RoadmapService
  ) {}

  ngOnInit(): void {
    this.profile = this.studentService.currentProfile;
  }
}
