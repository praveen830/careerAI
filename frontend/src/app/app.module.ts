import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Shared Components
import { IconComponent } from './shared/components/icon/icon.component';
import { CircularProgressComponent } from './shared/components/circular-progress/circular-progress.component';

// Layout Components
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

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    // Shared
    IconComponent,
    CircularProgressComponent,
    // Layouts
    PublicLayoutComponent,
    AppLayoutComponent,
    // Public Pages
    LandingComponent,
    AboutComponent,
    FeaturesComponent,
    LoginComponent,
    RegisterComponent,
    // Onboarding
    ProfileSetupComponent,
    SkillsSetupComponent,
    CareerGoalSetupComponent,
    // App
    DashboardComponent,
    SkillGapComponent,
    RoadmapComponent,
    ProjectsComponent,
    ResumeComponent,
    JobAnalyzerComponent,
    ProgressComponent,
    AiAssistantComponent,
    ProfileComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
