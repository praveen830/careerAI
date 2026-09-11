import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StudentService } from '../../../core/services/student.service';
import { TechnicalSkill, SkillLevel } from '../../../core/models';

interface AvailableSkill {
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI & Data' | 'Core CS';
  defaultLevel: SkillLevel;
  defaultProficiency: number;
}

@Component({
  selector: 'app-skills-setup',
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
          <div class="step-indicator active">
            <span class="step-num">2</span>
            <span class="step-title">Skills</span>
          </div>
          <div class="step-line"></div>
          <div class="step-indicator">
            <span class="step-num">3</span>
            <span class="step-title">Career Goal</span>
          </div>
        </div>

        <!-- Page Heading -->
        <div class="onboarding-header-area">
          <div class="header-text-block">
            <h2>Select Your Technical Skills</h2>
            <p class="text-secondary">
              Select all technologies and competencies you have experience with. You can adjust proficiency levels or pick a 1-click role preset below.
            </p>
          </div>
          <div class="selected-counter-badge">
            <span class="counter-num">{{ selectedSkillsCount }}</span>
            <span class="counter-lbl">Skills Selected</span>
          </div>
        </div>

        <!-- 1-Click Role Presets -->
        <div class="preset-strip">
          <span class="preset-label text-xs font-semibold text-muted">QUICK PRESETS:</span>
          <div class="preset-buttons">
            <button type="button" class="preset-btn" (click)="applyPreset('java-fullstack')">
              ☕ Java Full Stack
            </button>
            <button type="button" class="preset-btn" (click)="applyPreset('frontend')">
              🎨 Frontend Developer
            </button>
            <button type="button" class="preset-btn" (click)="applyPreset('data-analyst')">
              📊 Data Analyst
            </button>
            <button type="button" class="preset-btn" (click)="applyPreset('devops')">
              ⚙️ DevOps & Cloud
            </button>
            <button type="button" class="preset-btn" (click)="applyPreset('aiml')">
              🤖 AI & Machine Learning
            </button>
            <button type="button" class="preset-btn clear-btn" (click)="clearAllSkills()">
              ↺ Clear All
            </button>
          </div>
        </div>

        <!-- Search and Category Filters -->
        <div class="filter-controls-row">
          <div class="search-box">
            <app-icon name="search" [size]="16"></app-icon>
            <input
              type="text"
              class="search-input"
              [(ngModel)]="searchQuery"
              placeholder="Search skills (e.g. Angular, Spring Boot, Docker, Python)..."
            />
            <button class="clear-search" *ngIf="searchQuery" (click)="searchQuery = ''">✕</button>
          </div>

          <div class="category-tabs">
            <button
              type="button"
              class="cat-tab"
              [class.active]="selectedCategory === 'All'"
              (click)="selectedCategory = 'All'"
            >
              All ({{ catalog.length }})
            </button>
            <button
              type="button"
              class="cat-tab"
              *ngFor="let cat of categories"
              [class.active]="selectedCategory === cat"
              (click)="selectedCategory = cat"
            >
              {{ cat }}
            </button>
          </div>
        </div>

        <!-- Custom Skill Quick-Add Row -->
        <div class="custom-add-strip">
          <span class="custom-label text-xs font-semibold">Can't find a skill?</span>
          <div class="custom-input-group">
            <input
              type="text"
              class="custom-input"
              [(ngModel)]="customSkillName"
              placeholder="Type custom skill name (e.g. Next.js, FastAPI)..."
              (keyup.enter)="addCustomSkill()"
            />
            <select class="custom-select" [(ngModel)]="customSkillCategory">
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps">DevOps</option>
              <option value="AI & Data">AI & Data</option>
              <option value="Core CS">Core CS</option>
            </select>
            <button type="button" class="btn btn-sm btn-primary" (click)="addCustomSkill()">
              + Add Skill
            </button>
          </div>
        </div>

        <!-- Multi-Choice Skills Grid -->
        <div class="multi-choice-grid">
          <div
            class="choice-card"
            *ngFor="let item of filteredCatalog"
            [class.selected]="isSkillSelected(item.name)"
            (click)="toggleSkill(item)"
          >
            <div class="choice-top">
              <div class="checkbox-box" [class.checked]="isSkillSelected(item.name)">
                <span *ngIf="isSkillSelected(item.name)">✓</span>
              </div>
              <div class="choice-info">
                <span class="choice-name font-semibold">{{ item.name }}</span>
                <span class="badge" [ngClass]="getCategoryBadgeClass(item.category)">{{ item.category }}</span>
              </div>
            </div>

            <!-- If skill is selected, show quick proficiency adjustment -->
            <div class="choice-proficiency-ctrl" *ngIf="isSkillSelected(item.name)" (click)="$event.stopPropagation()">
              <div class="prof-header">
                <span class="text-xs text-muted">Proficiency:</span>
                <span class="text-xs font-bold text-primary">{{ getSkillProficiency(item.name) }}%</span>
                <span class="text-xs font-semibold" [ngClass]="getLevelClass(getSkillLevel(item.name))">({{ getSkillLevel(item.name) }})</span>
              </div>
              <div class="level-pills">
                <button
                  type="button"
                  class="lvl-pill"
                  [class.active]="getSkillLevel(item.name) === 'Beginner'"
                  (click)="setSkillLevel(item.name, 'Beginner', 35)"
                >
                  Beg (35%)
                </button>
                <button
                  type="button"
                  class="lvl-pill"
                  [class.active]="getSkillLevel(item.name) === 'Intermediate'"
                  (click)="setSkillLevel(item.name, 'Intermediate', 65)"
                >
                  Int (65%)
                </button>
                <button
                  type="button"
                  class="lvl-pill"
                  [class.active]="getSkillLevel(item.name) === 'Advanced'"
                  (click)="setSkillLevel(item.name, 'Advanced', 85)"
                >
                  Adv (85%)
                </button>
                <button
                  type="button"
                  class="lvl-pill"
                  [class.active]="getSkillLevel(item.name) === 'Expert'"
                  (click)="setSkillLevel(item.name, 'Expert', 95)"
                >
                  Exp (95%)
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Selected Skills Summary Cloud -->
        <div class="selected-summary-box" *ngIf="currentSkills.length > 0">
          <div class="summary-header">
            <span class="text-sm font-semibold">Your Selected Skills ({{ currentSkills.length }}):</span>
          </div>
          <div class="summary-chips">
            <div class="summary-chip" *ngFor="let s of currentSkills">
              <span class="chip-name font-semibold">{{ s.name }}</span>
              <span class="chip-prof">{{ s.proficiency }}%</span>
              <button class="chip-remove" (click)="removeSkill(s.id)" title="Remove skill">✕</button>
            </div>
          </div>
        </div>

        <!-- Navigation Footer -->
        <div class="form-actions-footer">
          <a routerLink="/onboarding/profile" class="btn btn-secondary">
            ← Back to Profile
          </a>
          <button type="button" class="btn btn-primary btn-lg" (click)="onContinue()">
            <span>Continue to Career Goal</span>
            <app-icon name="arrow-right" [size]="18"></app-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page {
      padding: 2.5rem 1.5rem 4rem;
      max-width: 1100px;
    }
    .onboarding-card {
      padding: 2.5rem;
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
      margin-bottom: 2rem;
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
      box-shadow: 0 0 12px rgba(79, 70, 229, 0.35);
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

    /* Header Area */
    .onboarding-header-area {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 1.5rem;
      margin-bottom: 1.75rem;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 1.25rem;
    }
    .header-text-block h2 {
      font-size: 1.85rem;
      color: #0f172a;
      margin-bottom: 0.35rem;
    }
    .selected-counter-badge {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.6rem 1.25rem;
      background: #eef2ff;
      border: 1px solid #c7d2fe;
      border-radius: var(--radius-lg);
      flex-shrink: 0;
    }
    .counter-num {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }
    .counter-lbl {
      font-size: 0.72rem;
      font-weight: 600;
      color: #4338ca;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    /* 1-Click Role Presets */
    .preset-strip {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1.25rem;
      padding: 0.75rem 1rem;
      background: #f8faff;
      border: 1px solid #e0e7ff;
      border-radius: var(--radius-md);
    }
    .preset-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .preset-btn {
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      font-weight: 600;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .preset-btn:hover {
      background: #eef2ff;
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-1px);
    }
    .preset-btn.clear-btn {
      color: #dc2626;
      border-color: #fecaca;
      background: #fff5f5;
    }
    .preset-btn.clear-btn:hover {
      background: #fee2e2;
      border-color: #dc2626;
    }

    /* Search & Filter Controls */
    .filter-controls-row {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 1rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: var(--radius-md);
      position: relative;
    }
    .search-input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 0.9rem;
      color: #0f172a;
      background: transparent;
    }
    .clear-search {
      color: #94a3b8;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .cat-tab {
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 600;
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #475569;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .cat-tab:hover {
      background: #e2e8f0;
      color: #0f172a;
    }
    .cat-tab.active {
      background: var(--primary);
      color: #ffffff;
      border-color: var(--primary);
      box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
    }

    /* Custom Add Strip */
    .custom-add-strip {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      padding: 0.65rem 1rem;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: var(--radius-md);
    }
    .custom-input-group {
      display: flex;
      gap: 0.5rem;
      flex: 1;
      align-items: center;
      flex-wrap: wrap;
    }
    .custom-input {
      flex: 1;
      min-width: 180px;
      padding: 0.45rem 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid #cbd5e1;
      font-size: 0.85rem;
      outline: none;
    }
    .custom-input:focus {
      border-color: var(--primary);
    }
    .custom-select {
      padding: 0.45rem 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid #cbd5e1;
      font-size: 0.85rem;
      outline: none;
      background: #fff;
    }

    /* Multi-Choice Grid */
    .multi-choice-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .choice-card {
      padding: 1rem;
      border-radius: var(--radius-md);
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all var(--transition-fast);
    }
    .choice-card:hover {
      border-color: #94a3b8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
    }
    .choice-card.selected {
      border-color: var(--primary);
      background: #f8faff;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.1);
    }
    .choice-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .checkbox-box {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      border: 2px solid #cbd5e1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 800;
      flex-shrink: 0;
      color: #fff;
      background: #ffffff;
      transition: all var(--transition-fast);
    }
    .checkbox-box.checked {
      background: var(--primary);
      border-color: var(--primary);
    }
    .choice-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex: 1;
    }
    .choice-name {
      font-size: 0.95rem;
      color: #0f172a;
    }

    /* Proficiency selector within card */
    .choice-proficiency-ctrl {
      padding-top: 0.65rem;
      border-top: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .prof-header {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .level-pills {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
    }
    .lvl-pill {
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-size: 0.72rem;
      font-weight: 600;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #475569;
      cursor: pointer;
      transition: all var(--transition-fast);
    }
    .lvl-pill:hover {
      border-color: var(--primary);
      color: var(--primary);
    }
    .lvl-pill.active {
      background: #4f46e5;
      color: #ffffff;
      border-color: #4f46e5;
    }

    /* Selected Summary Cloud */
    .selected-summary-box {
      padding: 1.25rem 1.5rem;
      border-radius: var(--radius-lg);
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      margin-bottom: 2rem;
    }
    .summary-header {
      margin-bottom: 0.75rem;
      color: #334155;
    }
    .summary-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .summary-chip {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      background: #ffffff;
      border: 1px solid #c7d2fe;
      font-size: 0.82rem;
    }
    .chip-name {
      color: #1e1b4b;
    }
    .chip-prof {
      color: var(--primary);
      font-weight: 700;
      font-size: 0.78rem;
    }
    .chip-remove {
      color: #94a3b8;
      cursor: pointer;
      font-size: 0.85rem;
      font-weight: 700;
    }
    .chip-remove:hover {
      color: #dc2626;
    }

    /* Footer */
    .form-actions-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
    }

    @media (max-width: 768px) {
      .onboarding-card { padding: 1.5rem; }
      .onboarding-header-area { flex-direction: column; align-items: flex-start; }
      .stepper-header { gap: 0.5rem; }
      .step-line { width: 20px; }
      .step-title { display: none; }
      .multi-choice-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SkillsSetupComponent implements OnInit, OnDestroy {
  public currentSkills: TechnicalSkill[] = [];
  public selectedCategory: string = 'All';
  public searchQuery: string = '';
  public customSkillName: string = '';
  public customSkillCategory: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI & Data' | 'Core CS' = 'Backend';

  public categories: ('Frontend' | 'Backend' | 'Database' | 'DevOps' | 'AI & Data' | 'Core CS')[] = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'AI & Data',
    'Core CS'
  ];

  // Comprehensive Catalog of Multiple-Choice Skills
  public catalog: AvailableSkill[] = [
    // Frontend
    { name: 'Angular', category: 'Frontend', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'React', category: 'Frontend', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'TypeScript', category: 'Frontend', defaultLevel: 'Intermediate', defaultProficiency: 70 },
    { name: 'JavaScript (ES6+)', category: 'Frontend', defaultLevel: 'Advanced', defaultProficiency: 80 },
    { name: 'HTML5 & CSS3', category: 'Frontend', defaultLevel: 'Advanced', defaultProficiency: 85 },
    { name: 'Tailwind CSS', category: 'Frontend', defaultLevel: 'Intermediate', defaultProficiency: 75 },
    { name: 'Vue.js', category: 'Frontend', defaultLevel: 'Beginner', defaultProficiency: 45 },
    { name: 'Next.js', category: 'Frontend', defaultLevel: 'Intermediate', defaultProficiency: 60 },
    { name: 'RxJS', category: 'Frontend', defaultLevel: 'Intermediate', defaultProficiency: 60 },
    { name: 'State Management (NgRx/Redux)', category: 'Frontend', defaultLevel: 'Intermediate', defaultProficiency: 55 },

    // Backend
    { name: 'Java', category: 'Backend', defaultLevel: 'Advanced', defaultProficiency: 75 },
    { name: 'Spring Boot', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'Spring Security', category: 'Backend', defaultLevel: 'Beginner', defaultProficiency: 40 },
    { name: 'REST APIs', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 70 },
    { name: 'Node.js', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'Express.js', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'Python', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 70 },
    { name: 'Django / FastAPI', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 60 },
    { name: 'Microservices Architecture', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 50 },
    { name: 'Hibernate / JPA', category: 'Backend', defaultLevel: 'Intermediate', defaultProficiency: 60 },

    // Database
    { name: 'MySQL', category: 'Database', defaultLevel: 'Advanced', defaultProficiency: 75 },
    { name: 'PostgreSQL', category: 'Database', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'MongoDB', category: 'Database', defaultLevel: 'Intermediate', defaultProficiency: 60 },
    { name: 'Redis', category: 'Database', defaultLevel: 'Beginner', defaultProficiency: 40 },
    { name: 'SQL Querying', category: 'Database', defaultLevel: 'Advanced', defaultProficiency: 80 },

    // DevOps & Cloud
    { name: 'Docker', category: 'DevOps', defaultLevel: 'Intermediate', defaultProficiency: 55 },
    { name: 'Kubernetes', category: 'DevOps', defaultLevel: 'Beginner', defaultProficiency: 35 },
    { name: 'Git & GitHub', category: 'DevOps', defaultLevel: 'Advanced', defaultProficiency: 80 },
    { name: 'CI/CD (GitHub Actions)', category: 'DevOps', defaultLevel: 'Intermediate', defaultProficiency: 50 },
    { name: 'Linux Administration', category: 'DevOps', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'AWS Cloud Basics', category: 'DevOps', defaultLevel: 'Beginner', defaultProficiency: 45 },
    { name: 'Terraform', category: 'DevOps', defaultLevel: 'Beginner', defaultProficiency: 30 },

    // AI & Data
    { name: 'Pandas & NumPy', category: 'AI & Data', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'Machine Learning Algorithms', category: 'AI & Data', defaultLevel: 'Intermediate', defaultProficiency: 55 },
    { name: 'PyTorch / TensorFlow', category: 'AI & Data', defaultLevel: 'Beginner', defaultProficiency: 40 },
    { name: 'Tableau / Power BI', category: 'AI & Data', defaultLevel: 'Intermediate', defaultProficiency: 55 },
    { name: 'Statistics & Math', category: 'AI & Data', defaultLevel: 'Intermediate', defaultProficiency: 65 },
    { name: 'LLMs & Prompt Engineering', category: 'AI & Data', defaultLevel: 'Intermediate', defaultProficiency: 60 },

    // Core CS
    { name: 'Data Structures & Algorithms', category: 'Core CS', defaultLevel: 'Advanced', defaultProficiency: 75 },
    { name: 'Object-Oriented Programming (OOP)', category: 'Core CS', defaultLevel: 'Advanced', defaultProficiency: 85 },
    { name: 'System Design Basics', category: 'Core CS', defaultLevel: 'Intermediate', defaultProficiency: 50 },
    { name: 'Operating Systems & Networking', category: 'Core CS', defaultLevel: 'Intermediate', defaultProficiency: 60 }
  ];

  private sub = new Subscription();

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub.add(
      this.studentService.skills$.subscribe(s => this.currentSkills = s)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public get selectedSkillsCount(): number {
    return this.currentSkills.length;
  }

  public get filteredCatalog(): AvailableSkill[] {
    return this.catalog.filter(item => {
      const matchCat = this.selectedCategory === 'All' || item.category === this.selectedCategory;
      const matchQuery = !this.searchQuery || item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }

  public isSkillSelected(skillName: string): boolean {
    const sLower = skillName.toLowerCase();
    return this.currentSkills.some(s => s.name.toLowerCase() === sLower);
  }

  public getSkillProficiency(skillName: string): number {
    const skill = this.currentSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    return skill ? skill.proficiency : 60;
  }

  public getSkillLevel(skillName: string): SkillLevel {
    const skill = this.currentSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    return skill ? skill.level : 'Intermediate';
  }

  public toggleSkill(item: AvailableSkill): void {
    const existing = this.currentSkills.find(s => s.name.toLowerCase() === item.name.toLowerCase());
    if (existing) {
      this.studentService.deleteSkill(existing.id);
    } else {
      this.studentService.addSkill({
        name: item.name,
        proficiency: item.defaultProficiency,
        level: item.defaultLevel,
        category: item.category === 'AI & Data' ? 'AI/ML' : item.category
      });
    }
  }

  public setSkillLevel(skillName: string, level: SkillLevel, proficiency: number): void {
    const existing = this.currentSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
    if (existing) {
      this.studentService.updateSkill(existing.id, {
        level,
        proficiency
      });
    }
  }

  public removeSkill(id: string): void {
    this.studentService.deleteSkill(id);
  }

  public applyPreset(role: string): void {
    let presetSkillNames: string[] = [];

    if (role === 'java-fullstack') {
      presetSkillNames = ['Java', 'Spring Boot', 'Spring Security', 'REST APIs', 'Angular', 'MySQL', 'Docker', 'Git & GitHub'];
    } else if (role === 'frontend') {
      presetSkillNames = ['Angular', 'TypeScript', 'JavaScript (ES6+)', 'HTML5 & CSS3', 'Tailwind CSS', 'RxJS', 'Git & GitHub', 'REST APIs'];
    } else if (role === 'data-analyst') {
      presetSkillNames = ['SQL Querying', 'Python', 'Pandas & NumPy', 'Tableau / Power BI', 'Statistics & Math', 'MySQL'];
    } else if (role === 'devops') {
      presetSkillNames = ['Linux Administration', 'Docker', 'Kubernetes', 'CI/CD (GitHub Actions)', 'AWS Cloud Basics', 'Git & GitHub', 'Terraform'];
    } else if (role === 'aiml') {
      presetSkillNames = ['Python', 'Pandas & NumPy', 'Machine Learning Algorithms', 'PyTorch / TensorFlow', 'Statistics & Math', 'LLMs & Prompt Engineering', 'Docker'];
    }

    presetSkillNames.forEach(name => {
      if (!this.isSkillSelected(name)) {
        const item = this.catalog.find(c => c.name.toLowerCase() === name.toLowerCase());
        if (item) {
          this.studentService.addSkill({
            name: item.name,
            proficiency: item.defaultProficiency,
            level: item.defaultLevel,
            category: item.category === 'AI & Data' ? 'AI/ML' : item.category
          });
        }
      }
    });
  }

  public clearAllSkills(): void {
    [...this.currentSkills].forEach(s => {
      this.studentService.deleteSkill(s.id);
    });
  }

  public addCustomSkill(): void {
    if (!this.customSkillName.trim()) return;
    const name = this.customSkillName.trim();
    if (this.isSkillSelected(name)) {
      this.customSkillName = '';
      return;
    }

    this.studentService.addSkill({
      name,
      proficiency: 65,
      level: 'Intermediate',
      category: this.customSkillCategory === 'AI & Data' ? 'AI/ML' : this.customSkillCategory
    });

    // Also add to catalog if not there
    if (!this.catalog.some(c => c.name.toLowerCase() === name.toLowerCase())) {
      this.catalog.unshift({
        name,
        category: this.customSkillCategory,
        defaultLevel: 'Intermediate',
        defaultProficiency: 65
      });
    }

    this.customSkillName = '';
  }

  public getCategoryBadgeClass(category: string): string {
    switch (category) {
      case 'Frontend': return 'badge-cyan';
      case 'Backend': return 'badge-primary';
      case 'Database': return 'badge-success';
      case 'DevOps': return 'badge-purple';
      case 'AI & Data': return 'badge-warning';
      case 'Core CS': return 'badge-info';
      default: return 'badge-info';
    }
  }

  public getLevelClass(level: string): string {
    switch (level) {
      case 'Beginner': return 'text-warning';
      case 'Intermediate': return 'text-primary';
      case 'Advanced': return 'text-success';
      case 'Expert': return 'text-cyan';
      default: return 'text-primary';
    }
  }

  public onContinue(): void {
    this.router.navigate(['/onboarding/career-goal']);
  }
}
