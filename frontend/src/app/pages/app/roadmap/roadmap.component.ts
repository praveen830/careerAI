import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoadmapService } from '../../../core/services/roadmap.service';
import { StudentService } from '../../../core/services/student.service';
import { RoadmapStage, StudentProfile } from '../../../core/models';

@Component({
  selector: 'app-roadmap',
  template: `
    <div class="roadmap-page">
      <!-- Roadmap Hero -->
      <section class="roadmap-header glass-card">
        <div class="header-details">
          <span class="badge badge-primary">Personalized Learning Path</span>
          <h1>{{ currentGoal }} Roadmap</h1>
          <p class="text-secondary">
            A structured, {{ stages.length }}-stage engineering curriculum designed for {{ currentGoal }}.
          </p>

          <div class="header-progress-wrap">
            <div class="progress-meta">
              <span class="text-sm font-semibold">Total Curriculum Completion: <strong>{{ overallProgress }}%</strong></span>
              <span class="text-xs text-muted">{{ stages.length }} Total Milestones</span>
            </div>
            <div class="progress-bar-container" style="height: 10px;">
              <div class="progress-bar-fill progress-bar-primary" [style.width.%]="overallProgress"></div>
            </div>
          </div>
        </div>

        <div class="header-stat-box">
          <div class="stat-pill glass-card">
            <span class="pill-number text-success">{{ completedStagesCount }}</span>
            <span class="pill-label">Stages Done</span>
          </div>
          <div class="stat-pill glass-card">
            <span class="pill-number text-cyan">{{ inProgressStagesCount }}</span>
            <span class="pill-label">In Progress</span>
          </div>
          <div class="stat-pill glass-card">
            <span class="pill-number text-muted">{{ upcomingStagesCount }}</span>
            <span class="pill-label">Upcoming</span>
          </div>
        </div>
      </section>

      <!-- Roadmap Stages Vertical Timeline -->
      <section class="stages-timeline">
        <div
          class="stage-block glass-card"
          *ngFor="let stage of stages"
          [class.stage-completed]="stage.status === 'completed'"
          [class.stage-in-progress]="stage.status === 'in-progress'"
          [class.stage-upcoming]="stage.status === 'upcoming'"
        >
          <div class="stage-left-rail">
            <div class="stage-marker">
              <span *ngIf="stage.status === 'completed'">✓</span>
              <span *ngIf="stage.status === 'in-progress'">→</span>
              <span *ngIf="stage.status === 'upcoming'">{{ stage.stageNumber }}</span>
            </div>
            <div class="stage-rail-line"></div>
          </div>

          <div class="stage-content">
            <div class="stage-header-row">
              <div class="stage-title-wrap">
                <span class="stage-num-tag text-xs font-semibold">STAGE {{ stage.stageNumber }}</span>
                <h3>{{ stage.title }}</h3>
              </div>

              <div class="stage-meta-badges">
                <span class="badge" [ngClass]="getStatusBadge(stage.status)">
                  <span *ngIf="stage.status === 'completed'">✓ Completed</span>
                  <span *ngIf="stage.status === 'in-progress'">→ In Progress</span>
                  <span *ngIf="stage.status === 'upcoming'">Upcoming</span>
                </span>
                <span class="badge badge-primary">⏱ {{ stage.estimatedHours }}</span>
              </div>
            </div>

            <p class="stage-desc text-secondary">{{ stage.description }}</p>

            <!-- Topics Checklist Accordion / Group -->
            <div class="topics-group">
              <div class="topics-header">
                <span class="text-xs font-semibold text-muted">CORE CONCEPTS & CHECKLIST:</span>
                <span class="text-xs text-secondary">
                  {{ getCompletedCount(stage) }} / {{ stage.topics.length }} completed
                </span>
              </div>

              <div class="topics-list grid-2">
                <div
                  class="topic-item glass-card"
                  *ngFor="let topic of stage.topics"
                  [class.completed]="topic.completed"
                  (click)="toggleTopic(stage.id, topic.id)"
                >
                  <div class="checkbox-custom">
                    <span *ngIf="topic.completed">✓</span>
                  </div>

                  <div class="topic-info">
                    <span class="topic-title font-semibold">{{ topic.title }}</span>
                    <div class="topic-concepts">
                      <span class="concept-chip" *ngFor="let c of topic.concepts">{{ c }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="stage-action-row" *ngIf="stage.status === 'in-progress'">
              <span class="text-sm font-semibold text-cyan">⚡ Active Stage — Continue your practice</span>
              <a routerLink="/projects" class="btn btn-sm btn-primary">
                Find Relevant Projects →
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .roadmap-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }

    /* Header */
    .roadmap-header {
      padding: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      background: linear-gradient(135deg, #ffffff 0%, #f8faff 50%, #eef2ff 100%);
      border: 1px solid #e0e7ff;
      border-radius: var(--radius-xl);
      box-shadow: 0 4px 16px rgba(79, 70, 229, 0.04);
    }
    .header-details h1 {
      font-size: 2.1rem;
      margin: 0.5rem 0 0.4rem;
      color: #0f172a;
    }
    .header-progress-wrap {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .progress-meta {
      display: flex;
      justify-content: space-between;
    }
    .header-stat-box {
      display: flex;
      gap: 1rem;
      flex-shrink: 0;
    }
    .stat-pill {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem 1.25rem;
      min-width: 90px;
      background: var(--bg-surface-elevated);
    }
    .pill-number {
      font-size: 1.85rem;
      font-weight: 800;
      line-height: 1;
    }
    .pill-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* Timeline Stages */
    .stages-timeline {
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
      position: relative;
    }
    .stage-block {
      display: flex;
      gap: 1.75rem;
      padding: 2rem 2.25rem;
      position: relative;
      transition: all var(--transition-fast);
    }
    .stage-block.stage-in-progress {
      border-color: var(--accent-cyan);
      box-shadow: 0 0 25px rgba(6, 182, 212, 0.15);
    }
    .stage-block.stage-completed {
      border-color: rgba(16, 185, 129, 0.3);
    }
    .stage-left-rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
    }
    .stage-marker {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.1rem;
      color: var(--text-secondary);
      z-index: 2;
    }
    .stage-block.stage-completed .stage-marker {
      background: var(--success);
      color: #fff;
      border-color: var(--success);
      box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
    }
    .stage-block.stage-in-progress .stage-marker {
      background: var(--accent-cyan);
      color: #0b0f19;
      border-color: var(--accent-cyan);
      box-shadow: 0 0 18px rgba(6, 182, 212, 0.5);
    }
    .stage-rail-line {
      width: 2px;
      flex: 1;
      background: var(--border-subtle);
      margin-top: 0.75rem;
    }
    .stage-content {
      flex: 1;
    }
    .stage-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .stage-title-wrap h3 {
      font-size: 1.35rem;
    }
    .stage-num-tag {
      color: var(--primary);
      letter-spacing: 0.08em;
    }
    .stage-meta-badges {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .stage-desc {
      font-size: 0.925rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }

    /* Topics Group */
    .topics-group {
      background: var(--bg-app);
      border-radius: var(--radius-md);
      padding: 1.25rem;
      border: 1px solid var(--border-subtle);
    }
    .topics-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
    }
    .topic-item {
      padding: 0.85rem 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      cursor: pointer;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      transition: all var(--transition-fast);
    }
    .topic-item:hover {
      border-color: var(--primary);
      background: var(--bg-surface-elevated);
    }
    .topic-item.completed {
      border-color: rgba(16, 185, 129, 0.35);
      background: rgba(16, 185, 129, 0.05);
    }
    .checkbox-custom {
      width: 20px;
      height: 20px;
      border-radius: var(--radius-xs);
      border: 2px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
      color: #fff;
      flex-shrink: 0;
      margin-top: 2px;
      transition: all var(--transition-fast);
    }
    .topic-item.completed .checkbox-custom {
      background: var(--success);
      border-color: var(--success);
    }
    .topic-info {
      flex: 1;
    }
    .topic-title {
      font-size: 0.9rem;
      display: block;
      margin-bottom: 0.35rem;
    }
    .topic-concepts {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }
    .concept-chip {
      font-size: 0.7rem;
      background: var(--bg-surface-elevated);
      color: var(--text-muted);
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-xs);
    }
    .stage-action-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1.25rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }

    @media (max-width: 860px) {
      .roadmap-header { flex-direction: column; text-align: center; }
      .header-stat-box { justify-content: center; }
      .stage-block { flex-direction: column; padding: 1.5rem; }
      .stage-left-rail { flex-direction: row; gap: 1rem; margin-bottom: 1rem; }
      .stage-rail-line { display: none; }
      .topics-list { grid-template-columns: 1fr; }
    }
  `]
})
export class RoadmapComponent implements OnInit, OnDestroy {
  public stages: RoadmapStage[] = [];
  public overallProgress: number = 38;
  public currentGoal: string = 'Java Full Stack Developer';
  private sub = new Subscription();

  constructor(
    private roadmapService: RoadmapService,
    private studentService: StudentService
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.roadmapService.stages$.subscribe(s => this.stages = s)
    );
    this.sub.add(
      this.roadmapService.overallProgress$.subscribe(p => this.overallProgress = p)
    );
    this.sub.add(
      this.studentService.profile$.subscribe((p: StudentProfile) => {
        if (p?.careerGoal) {
          this.currentGoal = p.careerGoal;
          this.roadmapService.loadRoadmapForGoal(p.careerGoal);
        }
      })
    );
  }

  public get completedStagesCount(): number {
    return this.stages.filter(s => s.status === 'completed').length;
  }

  public get inProgressStagesCount(): number {
    return this.stages.filter(s => s.status === 'in-progress').length;
  }

  public get upcomingStagesCount(): number {
    return this.stages.filter(s => s.status === 'upcoming').length;
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public getStatusBadge(status: string): string {
    if (status === 'completed') return 'badge-success';
    if (status === 'in-progress') return 'badge-cyan';
    return 'badge-info';
  }

  public getCompletedCount(stage: RoadmapStage): number {
    return stage.topics.filter(t => t.completed).length;
  }

  public toggleTopic(stageId: string, topicId: string): void {
    this.roadmapService.toggleTopic(stageId, topicId);
  }
}
