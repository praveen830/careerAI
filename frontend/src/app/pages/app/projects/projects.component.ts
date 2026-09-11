import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../core/services/project.service';
import { RecommendedProject } from '../../../core/models';

@Component({
  selector: 'app-projects',
  template: `
    <div class="projects-page">
      <!-- Page Header -->
      <section class="page-header glass-card">
        <div>
          <span class="badge badge-primary">Portfolio Accelerators</span>
          <h1>Recommended Industry Projects</h1>
          <p class="text-secondary">
            Build production-ready applications that prove your engineering ability to recruiters and eliminate your critical skill gaps.
          </p>
        </div>

        <div class="search-and-filters">
          <!-- Search input -->
          <div class="search-input-wrap">
            <app-icon name="search" [size]="16" class="search-icon"></app-icon>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search by keyword, skill or title..."
              [(ngModel)]="searchTerm"
            />
          </div>
        </div>
      </section>

      <!-- Category Filter Pills -->
      <section class="filters-row">
        <div class="category-chips">
          <button
            class="chip-btn"
            *ngFor="let cat of categories"
            [class.active]="selectedCategory === cat"
            (click)="selectedCategory = cat"
          >
            {{ cat }}
          </button>
        </div>

        <div class="difficulty-select-wrap">
          <label class="text-xs text-muted font-semibold">DIFFICULTY:</label>
          <select class="form-control select-sm" [(ngModel)]="selectedDifficulty">
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </section>

      <!-- Projects Grid -->
      <section class="projects-grid grid-3">
        <div
          class="project-card glass-card glass-card-interactive"
          *ngFor="let proj of filteredProjects"
        >
          <div class="card-visual-header">
            <div class="proj-icon-box">
              <app-icon name="folder-git" [size]="24" class="text-primary"></app-icon>
            </div>
            <div class="header-badges">
              <span class="badge" [ngClass]="getDifficultyBadge(proj.difficulty)">{{ proj.difficulty }}</span>
              <span class="badge badge-primary">⏱ {{ proj.duration }}</span>
            </div>
          </div>

          <div class="card-body">
            <h3 class="proj-title">{{ proj.title }}</h3>
            <p class="proj-desc text-secondary">{{ proj.description }}</p>

            <div class="skills-chips-wrap">
              <span class="badge badge-primary" *ngFor="let sk of proj.skills">{{ sk }}</span>
            </div>
          </div>

          <div class="card-footer">
            <button class="btn btn-primary btn-sm btn-full" (click)="openProjectModal(proj)">
              <span>View Project Blueprint</span>
              <app-icon name="arrow-right" [size]="14"></app-icon>
            </button>
          </div>
        </div>
      </section>

      <!-- Empty State -->
      <div class="empty-state glass-card text-center" *ngIf="filteredProjects.length === 0">
        <app-icon name="search" [size]="36" class="text-muted" style="margin-bottom: 0.75rem;"></app-icon>
        <h3>No projects found</h3>
        <p class="text-secondary text-sm">Try relaxing your search query or changing your category filter.</p>
        <button class="btn btn-secondary btn-sm" style="margin-top: 1rem;" (click)="resetFilters()">Reset Filters</button>
      </div>

      <!-- Project Details Modal -->
      <div class="modal-overlay" *ngIf="selectedProject" (click)="closeProjectModal()">
        <div class="modal-content glass-card project-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <div>
              <span class="badge" [ngClass]="getDifficultyBadge(selectedProject.difficulty)">{{ selectedProject.difficulty }}</span>
              <h2 style="margin-top: 0.4rem; font-size: 1.45rem;">{{ selectedProject.title }}</h2>
            </div>
            <button class="close-btn" (click)="closeProjectModal()">✕</button>
          </div>

          <div class="modal-body">
            <p class="text-secondary" style="line-height: 1.6; margin-bottom: 1.5rem;">
              {{ selectedProject.description }}
            </p>

            <div class="modal-section">
              <h4>Required Tech Stack</h4>
              <div class="skills-chips-wrap" style="margin-top: 0.5rem;">
                <span class="badge badge-primary" *ngFor="let sk of selectedProject.skills">{{ sk }}</span>
              </div>
            </div>

            <div class="modal-section" style="margin-top: 1.5rem;">
              <h4>Key Architecture Features</h4>
              <ul class="features-checklist">
                <li *ngFor="let feat of selectedProject.features">
                  {{ feat }}
                </li>
              </ul>
            </div>

            <div class="modal-section" style="margin-top: 1.5rem;">
              <h4>Recommended Implementation Steps</h4>
              <div class="step-mini-flow">
                <div class="mini-step">
                  <span class="step-idx">1</span>
                  <span>Set up Spring Boot Maven/Gradle backend with MySQL & JPA entities</span>
                </div>
                <div class="mini-step">
                  <span class="step-idx">2</span>
                  <span>Implement RESTful controllers with DTO validation and GlobalExceptionHandler</span>
                </div>
                <div class="mini-step">
                  <span class="step-idx">3</span>
                  <span>Configure Angular standalone frontend with HttpClient & responsive UI</span>
                </div>
                <div class="mini-step">
                  <span class="step-idx">4</span>
                  <span>Write multi-stage Dockerfile and test local docker-compose deployment</span>
                </div>
              </div>
            </div>

            <div class="starter-repo-box glass-card" style="margin-top: 1.5rem;">
              <span class="text-xs font-semibold text-muted">STARTER TEMPLATE:</span>
              <p class="text-sm" style="margin: 0.25rem 0 0.75rem;">Clone the GitHub starter repository with pre-configured boilerplate.</p>
              <code class="code-snippet">git clone https://github.com/careerai/{{ selectedProject.id }}-starter.git</code>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="closeProjectModal()">Close</button>
            <a routerLink="/roadmap" (click)="closeProjectModal()" class="btn btn-primary">
              Connect to Roadmap
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .projects-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1280px;
      margin: 0 auto;
    }
    .page-header {
      padding: 2.25rem 2.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
      flex-wrap: wrap;
    }
    .page-header h1 {
      font-size: 1.85rem;
      margin: 0.5rem 0 0.35rem;
    }
    .search-input-wrap {
      position: relative;
      width: 320px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }
    .search-input {
      padding-left: 2.25rem;
    }

    /* Filters */
    .filters-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .category-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .chip-btn {
      padding: 0.45rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .chip-btn:hover {
      border-color: var(--primary);
      color: var(--text-primary);
    }
    .chip-btn.active {
      background: var(--primary);
      color: #fff;
      border-color: var(--primary);
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }
    .difficulty-select-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .select-sm {
      padding: 0.4rem 0.8rem;
      font-size: 0.85rem;
      width: 140px;
    }

    /* Cards */
    .project-card {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
    }
    .card-visual-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
    }
    .proj-icon-box {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--primary-light);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-badges {
      display: flex;
      gap: 0.4rem;
    }
    .card-body {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .proj-title {
      font-size: 1.15rem;
      margin-bottom: 0.5rem;
    }
    .proj-desc {
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1.25rem;
      flex: 1;
    }
    .skills-chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
    }
    .btn-full {
      width: 100%;
    }

    /* Modal */
    .project-modal {
      max-width: 650px;
    }
    .features-checklist {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .features-checklist li {
      position: relative;
      padding-left: 1.5rem;
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    .features-checklist li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: var(--success);
      font-weight: bold;
    }
    .step-mini-flow {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-top: 0.5rem;
    }
    .mini-step {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .step-idx {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: var(--primary-light);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: bold;
      flex-shrink: 0;
    }
    .starter-repo-box {
      padding: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .code-snippet {
      display: block;
      padding: 0.5rem 0.75rem;
      background: var(--bg-app);
      border-radius: var(--radius-sm);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--accent-cyan);
    }
    .empty-state {
      padding: 3.5rem 1rem;
    }
    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .modal-body {
      padding: 1.5rem;
      max-height: 70vh;
      overflow-y: auto;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-subtle);
    }
    .close-btn {
      color: var(--text-muted);
      font-size: 1.25rem;
    }
  `]
})
export class ProjectsComponent implements OnInit {
  public projects: RecommendedProject[] = [];
  public searchTerm: string = '';
  public selectedCategory: string = 'All';
  public selectedDifficulty: string = 'All';
  public selectedProject: RecommendedProject | null = null;

  public categories: string[] = ['All', 'Java & Spring Boot', 'Full Stack', 'Cloud', 'Backend'];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getProjects().subscribe(projs => {
      this.projects = projs;
    });
  }

  get filteredProjects(): RecommendedProject[] {
    return this.projects.filter(p => {
      const matchSearch =
        !this.searchTerm ||
        p.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.skills.some(s => s.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchCat =
        this.selectedCategory === 'All' || p.category.toLowerCase().includes(this.selectedCategory.toLowerCase());

      const matchDiff =
        this.selectedDifficulty === 'All' || p.difficulty === this.selectedDifficulty;

      return matchSearch && matchCat && matchDiff;
    });
  }

  public getDifficultyBadge(diff: string): string {
    if (diff === 'Beginner') return 'badge-info';
    if (diff === 'Intermediate') return 'badge-primary';
    return 'badge-danger';
  }

  public openProjectModal(project: RecommendedProject): void {
    this.selectedProject = project;
  }

  public closeProjectModal(): void {
    this.selectedProject = null;
  }

  public resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.selectedDifficulty = 'All';
  }
}
