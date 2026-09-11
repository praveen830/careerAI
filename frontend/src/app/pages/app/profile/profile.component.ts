import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StudentService } from '../../../core/services/student.service';
import { StudentProfile } from '../../../core/models';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-page">
      <!-- Profile Header Hero Card -->
      <section class="profile-hero glass-card">
        <div class="profile-cover-gradient"></div>

        <div class="profile-meta-row">
          <div class="avatar-large">
            <span>{{ profile.fullName.charAt(0) }}</span>
          </div>

          <div class="profile-name-section">
            <div class="name-badge-line">
              <h1>{{ profile.fullName }}</h1>
              <span class="badge badge-primary">{{ profile.careerGoal }}</span>
            </div>
            <p class="text-secondary text-sm">
              {{ profile.degree }} • {{ profile.college }} (Class of {{ profile.graduationYear }})
            </p>
            <span class="text-xs text-muted">📍 {{ profile.location }}</span>
          </div>

          <button class="btn btn-primary btn-sm edit-profile-btn" (click)="openEditModal()">
            <app-icon name="edit-3" [size]="16"></app-icon>
            <span>Edit Profile</span>
          </button>
        </div>
      </section>

      <!-- Details Grid -->
      <div class="profile-grid grid-2">
        <!-- Academic & Career Info -->
        <div class="info-card glass-card">
          <div class="card-title-row">
            <h3>Academic Background</h3>
            <span class="badge badge-info">{{ profile.currentYear }}</span>
          </div>

          <div class="info-list">
            <div class="info-item">
              <span class="info-label">University</span>
              <span class="info-val font-semibold">{{ profile.college }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Degree / Branch</span>
              <span class="info-val font-semibold">{{ profile.degree }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Expected Graduation</span>
              <span class="info-val font-semibold">{{ profile.graduationYear }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Current Academic Standing</span>
              <span class="info-val text-success font-semibold">GPA: 8.8 / 10.0</span>
            </div>
          </div>
        </div>

        <!-- Links & Developer Presence -->
        <div class="info-card glass-card">
          <div class="card-title-row">
            <h3>Developer Presence</h3>
            <span class="badge badge-cyan">Online Profiles</span>
          </div>

          <div class="info-list">
            <div class="info-item">
              <span class="info-label">GitHub</span>
              <a [href]="profile.github" target="_blank" class="info-val link text-primary font-semibold">
                {{ profile.github }} ↗
              </a>
            </div>
            <div class="info-item">
              <span class="info-label">LinkedIn</span>
              <a [href]="profile.linkedin" target="_blank" class="info-val link text-cyan font-semibold">
                {{ profile.linkedin }} ↗
              </a>
            </div>
            <div class="info-item">
              <span class="info-label">Portfolio Site</span>
              <span class="info-val text-muted">https://praveen-portfolio.dev (Mock)</span>
            </div>
            <div class="info-item">
              <span class="info-label">Student Email</span>
              <span class="info-val text-secondary">{{ profile.email }}</span>
            </div>
          </div>
        </div>

        <!-- Bio & Aspirations -->
        <div class="info-card glass-card span-full">
          <div class="card-title-row">
            <h3>About & Career Aspirations</h3>
            <span class="badge badge-primary">Target: {{ profile.careerGoal }}</span>
          </div>
          <p class="bio-paragraph text-secondary">
            {{ profile.bio }}
          </p>

          <div class="career-metrics-row">
            <div class="metric-pill">
              <span class="m-val text-primary font-bold">{{ profile.readinessScore }}%</span>
              <span class="m-lbl">Current Readiness</span>
            </div>
            <div class="metric-pill">
              <span class="m-val text-warning font-bold">{{ profile.streakDays }} Days 🔥</span>
              <span class="m-lbl">Learning Streak</span>
            </div>
            <div class="metric-pill">
              <span class="m-val text-success font-bold">{{ profile.projectsCompleted }}</span>
              <span class="m-lbl">Projects Built</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div class="modal-overlay" *ngIf="showEditModal" (click)="closeEditModal()">
        <div class="modal-content glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>Edit Student Profile</h3>
            <button class="close-btn" (click)="closeEditModal()">✕</button>
          </div>

          <form (ngSubmit)="saveProfile()" class="modal-body">
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" class="form-control" [(ngModel)]="editForm.fullName" name="fullName" required />
            </div>

            <div class="form-group">
              <label class="form-label">College / University</label>
              <input type="text" class="form-control" [(ngModel)]="editForm.college" name="college" required />
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Degree</label>
                <input type="text" class="form-control" [(ngModel)]="editForm.degree" name="degree" />
              </div>
              <div class="form-group">
                <label class="form-label">Graduation Year</label>
                <input type="text" class="form-control" [(ngModel)]="editForm.graduationYear" name="gradYear" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Location</label>
              <input type="text" class="form-control" [(ngModel)]="editForm.location" name="location" />
            </div>

            <div class="form-group">
              <label class="form-label">GitHub URL</label>
              <input type="text" class="form-control" [(ngModel)]="editForm.github" name="github" />
            </div>

            <div class="form-group">
              <label class="form-label">LinkedIn URL</label>
              <input type="text" class="form-control" [(ngModel)]="editForm.linkedin" name="linkedin" />
            </div>

            <div class="form-group">
              <label class="form-label">Short Bio</label>
              <textarea class="form-control" rows="3" [(ngModel)]="editForm.bio" name="bio"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeEditModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      max-width: 1100px;
      margin: 0 auto;
    }
    .profile-hero {
      overflow: hidden;
      position: relative;
    }
    .profile-cover-gradient {
      height: 120px;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
    }
    .profile-meta-row {
      padding: 0 2rem 2rem;
      display: flex;
      align-items: flex-end;
      gap: 1.75rem;
      margin-top: -50px;
      flex-wrap: wrap;
    }
    .avatar-large {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: var(--bg-surface);
      border: 4px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      font-size: 2.5rem;
      font-weight: 800;
      box-shadow: var(--shadow-lg);
      flex-shrink: 0;
    }
    .profile-name-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .name-badge-line {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      flex-wrap: wrap;
    }
    .name-badge-line h1 {
      font-size: 1.85rem;
    }
    .edit-profile-btn {
      margin-bottom: 0.5rem;
    }

    /* Info Cards */
    .info-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .info-card.span-full {
      grid-column: 1 / -1;
    }
    .card-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .card-title-row h3 {
      font-size: 1.15rem;
    }
    .info-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .info-label {
      color: var(--text-muted);
    }
    .bio-paragraph {
      font-size: 0.95rem;
      line-height: 1.6;
    }
    .career-metrics-row {
      display: flex;
      gap: 1.5rem;
      margin-top: 1rem;
    }
    .metric-pill {
      background: var(--bg-surface-elevated);
      padding: 0.75rem 1.25rem;
      border-radius: var(--radius-md);
      display: flex;
      flex-direction: column;
    }
    .m-val {
      font-size: 1.25rem;
      line-height: 1.1;
    }
    .m-lbl {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }

    /* Modal */
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .modal-body {
      padding: 1.5rem;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
    }
    .close-btn {
      color: var(--text-muted);
      font-size: 1.25rem;
    }

    @media (max-width: 768px) {
      .profile-grid { grid-template-columns: 1fr; }
      .profile-meta-row { flex-direction: column; align-items: flex-start; gap: 1rem; }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  public profile!: StudentProfile;
  public showEditModal: boolean = false;
  public editForm!: StudentProfile;
  private sub = new Subscription();

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.sub.add(
      this.studentService.profile$.subscribe(p => {
        this.profile = p;
        this.editForm = { ...p };
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  public openEditModal(): void {
    this.editForm = { ...this.profile };
    this.showEditModal = true;
  }

  public closeEditModal(): void {
    this.showEditModal = false;
  }

  public saveProfile(): void {
    this.studentService.updateProfile(this.editForm);
    this.closeEditModal();
  }
}
