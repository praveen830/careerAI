import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StudentProfile, TechnicalSkill } from '../models';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private profileSubject = new BehaviorSubject<StudentProfile>({
    fullName: 'Praveen Kumar',
    email: 'praveen.dev@college.edu',
    college: 'National Institute of Technology',
    degree: 'B.Tech Computer Science',
    currentYear: '3rd Year',
    graduationYear: '2026',
    location: 'Bengaluru, India',
    github: 'https://github.com/praveen-dev',
    linkedin: 'https://linkedin.com/in/praveen-tech',
    bio: 'Aspiring Full Stack Engineer passionate about building scalable web applications, asynchronous APIs with Python & FastAPI, and responsive frontends.',
    careerGoal: 'Python Full Stack Developer',
    readinessScore: 68,
    streakDays: 7,
    projectsCompleted: 3,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  });

  private skillsSubject = new BehaviorSubject<TechnicalSkill[]>([
    {
      id: 'sk-1',
      name: 'Python',
      proficiency: 75,
      level: 'Advanced',
      requiredForGoal: 85,
      gap: 10,
      status: 'Strong',
      category: 'Backend'
    },
    {
      id: 'sk-2',
      name: 'FastAPI',
      proficiency: 45,
      level: 'Intermediate',
      requiredForGoal: 80,
      gap: 35,
      status: 'Needs Improvement',
      category: 'Backend'
    },
    {
      id: 'sk-3',
      name: 'TypeScript',
      proficiency: 65,
      level: 'Intermediate',
      requiredForGoal: 75,
      gap: 10,
      status: 'Strong',
      category: 'Frontend'
    },
    {
      id: 'sk-4',
      name: 'Angular',
      proficiency: 60,
      level: 'Intermediate',
      requiredForGoal: 75,
      gap: 15,
      status: 'Strong',
      category: 'Frontend'
    },
    {
      id: 'sk-5',
      name: 'PostgreSQL',
      proficiency: 70,
      level: 'Advanced',
      requiredForGoal: 80,
      gap: 10,
      status: 'Strong',
      category: 'Database'
    },
    {
      id: 'sk-6',
      name: 'Docker',
      proficiency: 25,
      level: 'Beginner',
      requiredForGoal: 70,
      gap: 45,
      status: 'Critical Gap',
      category: 'DevOps'
    },
    {
      id: 'sk-7',
      name: 'Redis & Celery',
      proficiency: 20,
      level: 'Beginner',
      requiredForGoal: 65,
      gap: 45,
      status: 'Critical Gap',
      category: 'Backend'
    }
  ]);

  public profile$: Observable<StudentProfile> = this.profileSubject.asObservable();
  public skills$: Observable<TechnicalSkill[]> = this.skillsSubject.asObservable();

  public get currentProfile(): StudentProfile {
    return this.profileSubject.value;
  }

  public get currentSkills(): TechnicalSkill[] {
    return this.skillsSubject.value;
  }

  public updateProfile(updated: Partial<StudentProfile>): void {
    this.profileSubject.next({
      ...this.profileSubject.value,
      ...updated
    });
  }

  public setCareerGoal(careerTitle: string): void {
    this.updateProfile({ careerGoal: careerTitle });
  }

  public addSkill(skill: Omit<TechnicalSkill, 'id' | 'gap' | 'status'>): void {
    const required = skill.requiredForGoal || 75;
    const gap = Math.max(0, required - skill.proficiency);
    let status: 'Strong' | 'Needs Improvement' | 'Critical Gap' = 'Strong';
    if (gap > 25) {
      status = 'Critical Gap';
    } else if (gap > 10) {
      status = 'Needs Improvement';
    }

    const newSkill: TechnicalSkill = {
      ...skill,
      id: 'sk-' + Date.now(),
      requiredForGoal: required,
      gap,
      status
    };

    const current = [...this.skillsSubject.value, newSkill];
    this.skillsSubject.next(current);
    this.recalculateReadiness();
  }

  public updateSkill(id: string, updates: Partial<TechnicalSkill>): void {
    const current = this.skillsSubject.value.map(s => {
      if (s.id === id) {
        const merged = { ...s, ...updates };
        const required = merged.requiredForGoal || 80;
        const gap = Math.max(0, required - merged.proficiency);
        let status: 'Strong' | 'Needs Improvement' | 'Critical Gap' = 'Strong';
        if (gap > 25) {
          status = 'Critical Gap';
        } else if (gap > 10) {
          status = 'Needs Improvement';
        }
        return { ...merged, gap, status };
      }
      return s;
    });

    this.skillsSubject.next(current);
    this.recalculateReadiness();
  }

  public deleteSkill(id: string): void {
    const current = this.skillsSubject.value.filter(s => s.id !== id);
    this.skillsSubject.next(current);
    this.recalculateReadiness();
  }

  private recalculateReadiness(): void {
    const skills = this.skillsSubject.value;
    if (!skills.length) return;
    const avg = skills.reduce((sum, s) => sum + (s.proficiency / (s.requiredForGoal || 80)), 0) / skills.length;
    const score = Math.min(99, Math.round(avg * 75));
    this.updateProfile({ readinessScore: score });
  }

  /**
   * Structured dashboard mock data helpers dynamically tailored to the student's career goal
   */
  public getDashboardSkills(goal?: string): { id: string; name: string; proficiency: number; status: 'Strong' | 'Needs Improvement' | 'Developing'; colorClass: string; category: string }[] {
    const targetGoal = (goal || this.profileSubject.value.careerGoal || '').toLowerCase();
    
    if (targetGoal.includes('python')) {
      return [
        { id: 'd-py-1', name: 'Python (3.12)', proficiency: 80, status: 'Strong', colorClass: 'success', category: 'Backend' },
        { id: 'd-py-2', name: 'FastAPI / Django', proficiency: 62, status: 'Developing', colorClass: 'primary', category: 'Backend' },
        { id: 'd-py-3', name: 'PostgreSQL & SQL', proficiency: 74, status: 'Strong', colorClass: 'success', category: 'Database' },
        { id: 'd-py-4', name: 'React / Angular', proficiency: 60, status: 'Developing', colorClass: 'cyan', category: 'Frontend' },
        { id: 'd-py-5', name: 'REST APIs & Async', proficiency: 52, status: 'Needs Improvement', colorClass: 'warning', category: 'Backend' },
        { id: 'd-py-6', name: 'Docker & Git', proficiency: 65, status: 'Developing', colorClass: 'purple', category: 'DevOps' }
      ];
    } else if (targetGoal.includes('frontend')) {
      return [
        { id: 'd-fe-1', name: 'Angular', proficiency: 68, status: 'Strong', colorClass: 'cyan', category: 'Frontend' },
        { id: 'd-fe-2', name: 'TypeScript', proficiency: 62, status: 'Developing', colorClass: 'primary', category: 'Frontend' },
        { id: 'd-fe-3', name: 'JavaScript (ES6+)', proficiency: 75, status: 'Strong', colorClass: 'success', category: 'Frontend' },
        { id: 'd-fe-4', name: 'HTML5 / CSS3', proficiency: 82, status: 'Strong', colorClass: 'success', category: 'Frontend' },
        { id: 'd-fe-5', name: 'REST API Integration', proficiency: 48, status: 'Needs Improvement', colorClass: 'warning', category: 'Frontend' },
        { id: 'd-fe-6', name: 'Git & GitHub', proficiency: 65, status: 'Developing', colorClass: 'purple', category: 'DevOps' }
      ];
    } else if (targetGoal.includes('data') || targetGoal.includes('analyst')) {
      return [
        { id: 'd-da-1', name: 'SQL Querying', proficiency: 72, status: 'Strong', colorClass: 'success', category: 'Database' },
        { id: 'd-da-2', name: 'Python', proficiency: 65, status: 'Developing', colorClass: 'primary', category: 'Data' },
        { id: 'd-da-3', name: 'Excel Advanced', proficiency: 78, status: 'Strong', colorClass: 'success', category: 'Data' },
        { id: 'd-da-4', name: 'Tableau / Power BI', proficiency: 42, status: 'Needs Improvement', colorClass: 'warning', category: 'Data' },
        { id: 'd-da-5', name: 'Statistics & Math', proficiency: 58, status: 'Developing', colorClass: 'cyan', category: 'Core CS' },
        { id: 'd-da-6', name: 'Pandas & NumPy', proficiency: 50, status: 'Needs Improvement', colorClass: 'warning', category: 'Data' }
      ];
    } else if (targetGoal.includes('ai') || targetGoal.includes('ml') || targetGoal.includes('machine')) {
      return [
        { id: 'd-ai-1', name: 'Python', proficiency: 74, status: 'Strong', colorClass: 'success', category: 'AI/ML' },
        { id: 'd-ai-2', name: 'PyTorch / TensorFlow', proficiency: 45, status: 'Needs Improvement', colorClass: 'warning', category: 'AI/ML' },
        { id: 'd-ai-3', name: 'Machine Learning Algorithms', proficiency: 60, status: 'Developing', colorClass: 'cyan', category: 'AI/ML' },
        { id: 'd-ai-4', name: 'Pandas & Data Wrangling', proficiency: 68, status: 'Strong', colorClass: 'primary', category: 'Data' },
        { id: 'd-ai-5', name: 'Vector DBs & LLMs', proficiency: 35, status: 'Needs Improvement', colorClass: 'warning', category: 'AI/ML' },
        { id: 'd-ai-6', name: 'Docker for ML', proficiency: 40, status: 'Needs Improvement', colorClass: 'purple', category: 'DevOps' }
      ];
    } else if (targetGoal.includes('devops') || targetGoal.includes('cloud')) {
      return [
        { id: 'd-do-1', name: 'Linux Administration', proficiency: 70, status: 'Strong', colorClass: 'success', category: 'DevOps' },
        { id: 'd-do-2', name: 'Docker Containers', proficiency: 60, status: 'Developing', colorClass: 'cyan', category: 'DevOps' },
        { id: 'd-do-3', name: 'Git & GitHub Actions', proficiency: 68, status: 'Strong', colorClass: 'primary', category: 'DevOps' },
        { id: 'd-do-4', name: 'Kubernetes', proficiency: 30, status: 'Needs Improvement', colorClass: 'warning', category: 'DevOps' },
        { id: 'd-do-5', name: 'AWS Cloud Basics', proficiency: 45, status: 'Needs Improvement', colorClass: 'warning', category: 'Cloud' },
        { id: 'd-do-6', name: 'Terraform IaC', proficiency: 25, status: 'Needs Improvement', colorClass: 'purple', category: 'DevOps' }
      ];
    } else if (targetGoal.includes('java') || targetGoal.includes('spring')) {
      // Java Full Stack Developer
      return [
        { id: 'd-1', name: 'Java', proficiency: 75, status: 'Strong', colorClass: 'success', category: 'Backend' },
        { id: 'd-2', name: 'Spring Boot', proficiency: 45, status: 'Needs Improvement', colorClass: 'warning', category: 'Backend' },
        { id: 'd-3', name: 'Angular', proficiency: 60, status: 'Developing', colorClass: 'cyan', category: 'Frontend' },
        { id: 'd-4', name: 'MySQL', proficiency: 70, status: 'Strong', colorClass: 'success', category: 'Database' },
        { id: 'd-5', name: 'REST API', proficiency: 40, status: 'Needs Improvement', colorClass: 'warning', category: 'Backend' },
        { id: 'd-6', name: 'Git/GitHub', proficiency: 65, status: 'Developing', colorClass: 'purple', category: 'DevOps' }
      ];
    } else {
      // General Software / Backend Developer
      return [
        { id: 'd-gen-1', name: 'Object-Oriented Programming', proficiency: 76, status: 'Strong', colorClass: 'success', category: 'Core CS' },
        { id: 'd-gen-2', name: 'RESTful API Architecture', proficiency: 58, status: 'Developing', colorClass: 'primary', category: 'Backend' },
        { id: 'd-gen-3', name: 'Database Design & SQL', proficiency: 70, status: 'Strong', colorClass: 'success', category: 'Database' },
        { id: 'd-gen-4', name: 'Modern Frontend Framework', proficiency: 60, status: 'Developing', colorClass: 'cyan', category: 'Frontend' },
        { id: 'd-gen-5', name: 'Microservices & System Design', proficiency: 42, status: 'Needs Improvement', colorClass: 'warning', category: 'Backend' },
        { id: 'd-gen-6', name: 'Git, Docker & CI/CD', proficiency: 65, status: 'Developing', colorClass: 'purple', category: 'DevOps' }
      ];
    }
  }

  public getBiggestSkillGaps(goal?: string): { id: string; name: string; current: number; required: number; gap: number; priority: 'Critical' | 'High' | 'Medium' }[] {
    const targetGoal = (goal || this.profileSubject.value.careerGoal || '').toLowerCase();

    if (targetGoal.includes('python')) {
      return [
        { id: 'gap-py-1', name: 'FastAPI & Asynchronous Architecture', current: 40, required: 80, gap: 40, priority: 'Critical' },
        { id: 'gap-py-2', name: 'Redis Caching & Celery Background Tasks', current: 30, required: 75, gap: 45, priority: 'Critical' },
        { id: 'gap-py-3', name: 'PostgreSQL Indexing & Optimization', current: 45, required: 80, gap: 35, priority: 'High' }
      ];
    } else if (targetGoal.includes('frontend')) {
      return [
        { id: 'gap-fe-1', name: 'REST API Integration & RxJS', current: 40, required: 80, gap: 40, priority: 'Critical' },
        { id: 'gap-fe-2', name: 'State Management (NgRx/Signals)', current: 30, required: 75, gap: 45, priority: 'Critical' },
        { id: 'gap-fe-3', name: 'Unit Testing (Jest/Cypress)', current: 35, required: 70, gap: 35, priority: 'High' }
      ];
    } else if (targetGoal.includes('data') || targetGoal.includes('analyst')) {
      return [
        { id: 'gap-da-1', name: 'Tableau / Power BI Visualizations', current: 35, required: 80, gap: 45, priority: 'Critical' },
        { id: 'gap-da-2', name: 'Advanced SQL (Window Functions)', current: 45, required: 85, gap: 40, priority: 'High' },
        { id: 'gap-da-3', name: 'Statistical Hypothesis Testing', current: 40, required: 75, gap: 35, priority: 'High' }
      ];
    } else if (targetGoal.includes('ai') || targetGoal.includes('ml') || targetGoal.includes('machine')) {
      return [
        { id: 'gap-ai-1', name: 'PyTorch Deep Learning', current: 30, required: 80, gap: 50, priority: 'Critical' },
        { id: 'gap-ai-2', name: 'LLMs, LangChain & Vector DBs', current: 25, required: 75, gap: 50, priority: 'Critical' },
        { id: 'gap-ai-3', name: 'MLOps & Model Deployment', current: 20, required: 70, gap: 50, priority: 'High' }
      ];
    } else if (targetGoal.includes('devops') || targetGoal.includes('cloud')) {
      return [
        { id: 'gap-do-1', name: 'Kubernetes Cluster Management', current: 25, required: 80, gap: 55, priority: 'Critical' },
        { id: 'gap-do-2', name: 'Terraform Infrastructure as Code', current: 30, required: 75, gap: 45, priority: 'Critical' },
        { id: 'gap-do-3', name: 'AWS Cloud Architecture & IAM', current: 38, required: 80, gap: 42, priority: 'High' }
      ];
    } else if (targetGoal.includes('java') || targetGoal.includes('spring')) {
      return [
        { id: 'gap-1', name: 'Spring Security & JWT', current: 35, required: 75, gap: 40, priority: 'Critical' },
        { id: 'gap-2', name: 'REST API & Microservices', current: 40, required: 80, gap: 40, priority: 'High' },
        { id: 'gap-3', name: 'Docker & Containerization', current: 20, required: 65, gap: 45, priority: 'High' }
      ];
    } else {
      return [
        { id: 'gap-gen-1', name: 'Microservices & System Design', current: 35, required: 75, gap: 40, priority: 'Critical' },
        { id: 'gap-gen-2', name: 'Distributed Caching (Redis)', current: 40, required: 80, gap: 40, priority: 'High' },
        { id: 'gap-gen-3', name: 'Containerization & CI/CD', current: 30, required: 70, gap: 40, priority: 'High' }
      ];
    }
  }

  public getNextStepRecommendation(goal?: string): { title: string; description: string; estimatedTime: string; currentProgress: number; targetRole: string } {
    const targetRole = goal || this.profileSubject.value.careerGoal || 'Python Full Stack Developer';
    const lower = targetRole.toLowerCase();

    if (lower.includes('python')) {
      return {
        title: 'Master FastAPI & Asynchronous Architecture',
        description: `High-throughput asynchronous APIs and background tasks with Celery/Redis are your top priority gaps for ${targetRole}.`,
        estimatedTime: '2 weeks',
        currentProgress: 45,
        targetRole
      };
    } else if (lower.includes('frontend')) {
      return {
        title: 'Master State Management & Signals',
        description: `Deep dive into reactive Angular signals and NgRx architecture to match top ${targetRole} hiring standards.`,
        estimatedTime: '2 weeks',
        currentProgress: 40,
        targetRole
      };
    } else if (lower.includes('data') || lower.includes('analyst')) {
      return {
        title: 'Build Interactive Dashboards in Power BI',
        description: `Create enterprise executive KPI dashboards to close your biggest visual reporting gap for ${targetRole}.`,
        estimatedTime: '2 weeks',
        currentProgress: 35,
        targetRole
      };
    } else if (lower.includes('ai') || lower.includes('ml')) {
      return {
        title: 'Train Deep Learning Models with PyTorch',
        description: `Implement neural networks and computer vision/NLP pipelines to accelerate your ${targetRole} readiness.`,
        estimatedTime: '3 weeks',
        currentProgress: 30,
        targetRole
      };
    } else if (lower.includes('devops') || lower.includes('cloud')) {
      return {
        title: 'Deploy Production Clusters on Kubernetes',
        description: `Container orchestration and ingress controllers are your highest-priority gap for ${targetRole}.`,
        estimatedTime: '2 weeks',
        currentProgress: 25,
        targetRole
      };
    } else if (lower.includes('java') || lower.includes('spring')) {
      return {
        title: 'Learn Spring Security & JWT',
        description: `Spring Security is currently your biggest bottleneck for your ${targetRole} goal.`,
        estimatedTime: '2 weeks',
        currentProgress: 35,
        targetRole
      };
    } else {
      return {
        title: 'Design Scalable Microservices Architecture',
        description: `Distributed system patterns, API gateways, and asynchronous messaging are essential for ${targetRole}.`,
        estimatedTime: '2 weeks',
        currentProgress: 38,
        targetRole
      };
    }
  }

  public getRoadmapSteps(goal?: string): { id: string; title: string; status: 'completed' | 'in-progress' | 'upcoming'; progress?: number }[] {
    const lower = (goal || this.profileSubject.value.careerGoal || '').toLowerCase();

    if (lower.includes('python')) {
      return [
        { id: 'py-1', title: 'Python 3.12 Core & Advanced OOP', status: 'completed', progress: 100 },
        { id: 'py-2', title: 'PostgreSQL & Database Optimization', status: 'completed', progress: 100 },
        { id: 'py-3', title: 'FastAPI & Asynchronous REST APIs', status: 'in-progress', progress: 55 },
        { id: 'py-4', title: 'Django REST Framework & JWT Auth', status: 'in-progress', progress: 40 },
        { id: 'py-5', title: 'Frontend Integration (React / Angular)', status: 'upcoming', progress: 0 },
        { id: 'py-6', title: 'Redis Caching & Celery Background Tasks', status: 'upcoming', progress: 0 },
        { id: 'py-7', title: 'Docker, CI/CD & AWS Cloud Deployment', status: 'upcoming', progress: 0 }
      ];
    } else if (lower.includes('frontend')) {
      return [
        { id: 'fe-1', title: 'HTML5 & Responsive CSS', status: 'completed', progress: 100 },
        { id: 'fe-2', title: 'Modern JavaScript (ES6+)', status: 'completed', progress: 100 },
        { id: 'fe-3', title: 'TypeScript Fundamentals', status: 'in-progress', progress: 65 },
        { id: 'fe-4', title: 'Angular Core & Components', status: 'in-progress', progress: 50 },
        { id: 'fe-5', title: 'RxJS & Reactive Forms', status: 'upcoming', progress: 0 },
        { id: 'fe-6', title: 'State Management & Signals', status: 'upcoming', progress: 0 },
        { id: 'fe-7', title: 'Testing with Jest/Cypress', status: 'upcoming', progress: 0 },
        { id: 'fe-8', title: 'Web Performance & SEO', status: 'upcoming', progress: 0 }
      ];
    } else if (lower.includes('data') || lower.includes('analyst')) {
      return [
        { id: 'da-1', title: 'Excel & Data Manipulation', status: 'completed', progress: 100 },
        { id: 'da-2', title: 'SQL Queries & Joins', status: 'completed', progress: 100 },
        { id: 'da-3', title: 'Python for Data Analysis', status: 'in-progress', progress: 60 },
        { id: 'da-4', title: 'Pandas & NumPy Wrangling', status: 'in-progress', progress: 40 },
        { id: 'da-5', title: 'Tableau & Power BI Dashboards', status: 'upcoming', progress: 0 },
        { id: 'da-6', title: 'Statistical Hypothesis Testing', status: 'upcoming', progress: 0 },
        { id: 'da-7', title: 'Executive Data Storytelling', status: 'upcoming', progress: 0 }
      ];
    } else if (lower.includes('ai') || lower.includes('ml')) {
      return [
        { id: 'ai-1', title: 'Python & Scientific Computing', status: 'completed', progress: 100 },
        { id: 'ai-2', title: 'Mathematics & Linear Algebra', status: 'completed', progress: 100 },
        { id: 'ai-3', title: 'Classic Machine Learning', status: 'in-progress', progress: 55 },
        { id: 'ai-4', title: 'PyTorch Deep Learning', status: 'upcoming', progress: 0 },
        { id: 'ai-5', title: 'LLMs, Prompt Eng & RAG', status: 'upcoming', progress: 0 },
        { id: 'ai-6', title: 'Vector DBs & LangChain', status: 'upcoming', progress: 0 },
        { id: 'ai-7', title: 'MLOps & Model Deployment', status: 'upcoming', progress: 0 }
      ];
    } else if (lower.includes('devops') || lower.includes('cloud')) {
      return [
        { id: 'do-1', title: 'Linux Administration & Bash', status: 'completed', progress: 100 },
        { id: 'do-2', title: 'Git & Version Control', status: 'completed', progress: 100 },
        { id: 'do-3', title: 'Docker Containerization', status: 'in-progress', progress: 60 },
        { id: 'do-4', title: 'Kubernetes Orchestration', status: 'upcoming', progress: 0 },
        { id: 'do-5', title: 'CI/CD Pipelines with GitHub Actions', status: 'upcoming', progress: 0 },
        { id: 'do-6', title: 'Terraform & Infrastructure as Code', status: 'upcoming', progress: 0 },
        { id: 'do-7', title: 'AWS Cloud Solutions & Security', status: 'upcoming', progress: 0 }
      ];
    } else if (lower.includes('java') || lower.includes('spring')) {
      return [
        { id: 'step-1', title: 'Java Fundamentals', status: 'completed', progress: 100 },
        { id: 'step-2', title: 'OOP & Collections', status: 'completed', progress: 100 },
        { id: 'step-3', title: 'Advanced Java', status: 'completed', progress: 100 },
        { id: 'step-4', title: 'Spring Boot', status: 'in-progress', progress: 45 },
        { id: 'step-5', title: 'Spring Security', status: 'upcoming', progress: 0 },
        { id: 'step-6', title: 'REST APIs', status: 'upcoming', progress: 0 },
        { id: 'step-7', title: 'Angular', status: 'upcoming', progress: 0 },
        { id: 'step-8', title: 'Docker', status: 'upcoming', progress: 0 },
        { id: 'step-9', title: 'Cloud', status: 'upcoming', progress: 0 }
      ];
    } else {
      return [
        { id: 'gen-1', title: 'Computer Science & Algorithms', status: 'completed', progress: 100 },
        { id: 'gen-2', title: 'Database Design & SQL', status: 'completed', progress: 100 },
        { id: 'gen-3', title: 'RESTful API Engineering', status: 'in-progress', progress: 60 },
        { id: 'gen-4', title: 'System Architecture & Microservices', status: 'in-progress', progress: 35 },
        { id: 'gen-5', title: 'Distributed Caching & Queues', status: 'upcoming', progress: 0 },
        { id: 'gen-6', title: 'Docker & Containerization', status: 'upcoming', progress: 0 },
        { id: 'gen-7', title: 'CI/CD & Cloud Infrastructure', status: 'upcoming', progress: 0 }
      ];
    }
  }

  public getQuickActions(): { id: string; title: string; description: string; icon: string; route: string; colorClass: string }[] {
    return [
      { id: 'qa-1', title: 'Analyze Skills', description: 'Check your career skill gaps', icon: 'bar-chart-2', route: '/skill-gap', colorClass: 'primary' },
      { id: 'qa-2', title: 'Build Roadmap', description: 'See what you should learn next', icon: 'compass', route: '/roadmap', colorClass: 'cyan' },
      { id: 'qa-3', title: 'Analyze Resume', description: 'Improve your resume', icon: 'file-text', route: '/resume', colorClass: 'emerald' },
      { id: 'qa-4', title: 'Ask AI Assistant', description: 'Get personalized career guidance', icon: 'sparkles', route: '/ai-assistant', colorClass: 'purple' }
    ];
  }
}

