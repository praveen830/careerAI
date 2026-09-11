import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StudentService } from '../../../core/services/student.service';
import { StudentProfile } from '../../../core/models';

@Component({
  selector: 'app-profile-setup',
  template: `
    <div class="onboarding-page container">
      <div class="onboarding-card glass-card">
        <!-- Progress Stepper Header -->
        <div class="stepper-header">
          <div class="step-indicator active">
            <span class="step-num">1</span>
            <span class="step-title">Profile</span>
          </div>
          <div class="step-line"></div>
          <div class="step-indicator">
            <span class="step-num">2</span>
            <span class="step-title">Skills</span>
          </div>
          <div class="step-line"></div>
          <div class="step-indicator">
            <span class="step-num">3</span>
            <span class="step-title">Career Goal</span>
          </div>
        </div>

        <div class="onboarding-title-area text-center">
          <h2>Step 1 → Profile Setup</h2>
          <p class="text-secondary">Tell us about your college, degree, and developer presence.</p>
        </div>

        <form (ngSubmit)="onContinue()" class="profile-form">
          <div class="grid-2">
            <!-- Full Name -->
            <div class="form-group">
              <label class="form-label" for="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                class="form-control"
                [(ngModel)]="profile.fullName"
                required
                placeholder="Praveen"
              />
            </div>

            <!-- College -->
            <div class="form-group">
              <label class="form-label" for="college">College / University</label>
              <input
                type="text"
                id="college"
                name="college"
                class="form-control"
                [(ngModel)]="profile.college"
                required
                placeholder="National Institute of Technology"
              />
            </div>

            <!-- Degree -->
            <div class="form-group">
              <label class="form-label" for="degree">Degree / Major</label>
              <input
                type="text"
                id="degree"
                name="degree"
                class="form-control"
                [(ngModel)]="profile.degree"
                required
                placeholder="B.Tech Computer Science"
              />
            </div>

            <!-- Current Year -->
            <div class="form-group">
              <label class="form-label" for="currentYear">Current Year of Study</label>
              <select id="currentYear" name="currentYear" class="form-control" [(ngModel)]="profile.currentYear">
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year / Final Year">4th Year / Final Year</option>
                <option value="Recent Graduate">Recent Graduate</option>
              </select>
            </div>

            <!-- Graduation Year -->
            <div class="form-group">
              <label class="form-label" for="graduationYear">Graduation Year</label>
              <input
                type="text"
                id="graduationYear"
                name="graduationYear"
                class="form-control"
                [(ngModel)]="profile.graduationYear"
                placeholder="2026"
              />
            </div>

            <!-- Location -->
            <div class="form-group">
              <label class="form-label" for="location">Location / City</label>
              <input
                type="text"
                id="location"
                name="location"
                class="form-control"
                [(ngModel)]="profile.location"
                placeholder="Bengaluru, India"
              />
            </div>

            <!-- GitHub -->
            <div class="form-group">
              <label class="form-label" for="github">GitHub Profile URL</label>
              <input
                type="text"
                id="github"
                name="github"
                class="form-control"
                [(ngModel)]="profile.github"
                placeholder="https://github.com/praveen-dev"
              />
            </div>

            <!-- LinkedIn -->
            <div class="form-group">
              <label class="form-label" for="linkedin">LinkedIn Profile URL</label>
              <input
                type="text"
                id="linkedin"
                name="linkedin"
                class="form-control"
                [(ngModel)]="profile.linkedin"
                placeholder="https://linkedin.com/in/praveen-tech"
              />
            </div>
          </div>

          <!-- Short Bio -->
          <div class="form-group" style="margin-top: 0.5rem;">
            <label class="form-label" for="bio">Short Bio / Career Aspirations</label>
            <textarea
              id="bio"
              name="bio"
              rows="3"
              class="form-control"
              [(ngModel)]="profile.bio"
              placeholder="Aspiring Full Stack Engineer passionate about building scalable backends with Java Spring Boot and modern frontend web apps..."
            ></textarea>
          </div>

          <!-- Action Footer -->
          <div class="form-actions-footer">
            <button type="submit" class="btn btn-primary btn-lg">
              <span>Continue to Skills Setup</span>
              <app-icon name="arrow-right" [size]="18"></app-icon>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-page {
      padding: 3rem 1.5rem 5rem;
      max-width: 840px;
    }
    .onboarding-card {
      padding: 3rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
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
    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
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
      box-shadow: 0 0 12px rgba(99, 102, 241, 0.4);
    }
    .step-line {
      width: 48px;
      height: 2px;
      background: var(--border-subtle);
    }
    .onboarding-title-area {
      margin-bottom: 2.5rem;
    }
    .onboarding-title-area h2 {
      font-size: 1.85rem;
      margin-bottom: 0.5rem;
    }
    .form-actions-footer {
      display: flex;
      justify-content: flex-end;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
    }
    @media (max-width: 768px) {
      .onboarding-card { padding: 1.75rem; }
      .stepper-header { gap: 0.5rem; }
      .step-line { width: 20px; }
      .step-title { display: none; }
    }
  `]
})
export class ProfileSetupComponent implements OnInit {
  public profile!: StudentProfile;

  constructor(
    private studentService: StudentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profile = { ...this.studentService.currentProfile };
  }

  public onContinue(): void {
    this.studentService.updateProfile(this.profile);
    this.router.navigate(['/onboarding/skills']);
  }
}
