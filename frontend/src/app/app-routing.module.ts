import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Layouts
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';

// Public Pages
import { LandingComponent } from './pages/public/landing/landing.component';
import { AboutComponent } from './pages/public/about/about.component';
import { FeaturesComponent } from './pages/public/features/features.component';
import { LoginComponent } from './pages/public/login/login.component';
import { RegisterComponent } from './pages/public/register/register.component';

// Onboarding Pages
import { ProfileSetupComponent } from './pages/onboarding/profile-setup/profile-setup.component';
import { SkillsSetupComponent } from './pages/onboarding/skills-setup/skills-setup.component';
import { CareerGoalSetupComponent } from './pages/onboarding/career-goal-setup/career-goal-setup.component';

// App Pages
import { DashboardComponent } from './pages/app/dashboard/dashboard.component';
import { SkillGapComponent } from './pages/app/skill-gap/skill-gap.component';
import { RoadmapComponent } from './pages/app/roadmap/roadmap.component';
import { ProjectsComponent } from './pages/app/projects/projects.component';
import { ResumeComponent } from './pages/app/resume/resume.component';
import { JobAnalyzerComponent } from './pages/app/job-analyzer/job-analyzer.component';
import { ProgressComponent } from './pages/app/progress/progress.component';
import { AiAssistantComponent } from './pages/app/ai-assistant/ai-assistant.component';
import { ProfileComponent } from './pages/app/profile/profile.component';
import { SettingsComponent } from './pages/app/settings/settings.component';

const routes: Routes = [
  // Dedicated Master Landing Page
  { path: '', component: LandingComponent },

  // Public Marketing & Auth Pages (Public Layout: Navbar + Footer, No Sidebar)
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'about', component: AboutComponent },
      { path: 'features', component: FeaturesComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },

  // Student Dashboard Application (AppLayoutComponent: Sidebar + Topbar + Content Outlet)
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'skills', component: SkillsSetupComponent },
      { path: 'career-goal', component: CareerGoalSetupComponent },
      { path: 'onboarding/profile', component: ProfileSetupComponent },
      { path: 'onboarding/skills', component: SkillsSetupComponent },
      { path: 'onboarding/career-goal', component: CareerGoalSetupComponent },
      { path: 'skill-gap', component: SkillGapComponent },
      { path: 'roadmap', component: RoadmapComponent },
      { path: 'projects', component: ProjectsComponent },
      { path: 'resume', component: ResumeComponent },
      { path: 'job-analyzer', component: JobAnalyzerComponent },
      { path: 'progress', component: ProgressComponent },
      { path: 'ai-assistant', component: AiAssistantComponent },
      { path: 'settings', component: SettingsComponent }
    ]
  },

  // Catch-all
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
