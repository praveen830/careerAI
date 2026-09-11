import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RecommendedProject } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: RecommendedProject[] = [
    {
      id: 'proj-1',
      title: 'Student Management System',
      description: 'A comprehensive academic record platform with role-based dashboard, attendance management, GPA calculations, and exportable PDF transcripts.',
      skills: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Hibernate'],
      difficulty: 'Intermediate',
      duration: '3–4 weeks',
      category: 'Java & Spring Boot',
      icon: 'graduation-cap',
      features: [
        'Role-Based Access Control (Admin, Faculty, Student)',
        'Pagination & Filtering with Spring Data JPA',
        'Automated Grade Point Calculation Engine',
        'PDF Export for Semester Grade Cards'
      ]
    },
    {
      id: 'proj-2',
      title: 'E-Commerce Enterprise Application',
      description: 'Production-grade store featuring shopping cart state, order workflows, Stripe payment webhook simulation, inventory tracking, and JWT protection.',
      skills: ['Angular', 'Spring Boot', 'MySQL', 'JWT', 'Docker'],
      difficulty: 'Advanced',
      duration: '5–6 weeks',
      category: 'Full Stack',
      icon: 'shopping-bag',
      features: [
        'Reactive NgRx/BehaviorSubject Shopping Cart',
        'Stateless JWT Authentication with Refresh Token Rotation',
        'Transactional Order Management & Stock Verification',
        'Elasticsearch/Fuzzy Product Catalog Search'
      ]
    },
    {
      id: 'proj-3',
      title: 'Developer Job Portal & Application Tracker',
      description: 'Interactive career platform where recruiters post engineering roles and candidates submit resumes, track application status, and take skill quizzes.',
      skills: ['Angular', 'Spring Boot', 'REST API', 'JWT', 'PostgreSQL'],
      difficulty: 'Advanced',
      duration: '4–5 weeks',
      category: 'Full Stack',
      icon: 'briefcase',
      features: [
        'Real-time Application Status Pipeline (Kanban board)',
        'Resume File Upload & Storage Management',
        'Automated Email Notifications with Spring Mail',
        'Candidate Match Percentage Scoring Algorithm'
      ]
    },
    {
      id: 'proj-4',
      title: 'Cloud Task Management & Sprint Board',
      description: 'Collaborative task planner with drag-and-drop Kanban columns, team assignments, deadline reminders, and containerized deployment.',
      skills: ['Angular', 'Spring Boot', 'Docker', 'REST API', 'H2/MySQL'],
      difficulty: 'Intermediate',
      duration: '2–3 weeks',
      category: 'Cloud',
      icon: 'check-square',
      features: [
        'Drag-and-Drop Task Prioritization',
        'Sprint Metrics & Burndown Charts',
        'Multi-stage Dockerfile Packaging',
        'Unit & Integration Testing with Mockito'
      ]
    },
    {
      id: 'proj-5',
      title: 'Microservices Banking & Wallet Core',
      description: 'High-throughput financial ledger composed of independent microservices for accounts, transfers, ledger audit, and rate-limited API gateway.',
      skills: ['Java', 'Spring Boot', 'Docker', 'AWS', 'Kafka', 'Redis'],
      difficulty: 'Advanced',
      duration: '6–8 weeks',
      category: 'Backend',
      icon: 'shield-check',
      features: [
        'Event-Driven Transactions via Apache Kafka',
        'Distributed Caching & Idempotency with Redis',
        'Spring Cloud Gateway with Token Validation',
        'Circuit Breaker Pattern with Resilience4j'
      ]
    },
    {
      id: 'proj-6',
      title: 'Real-Time Chat & Collaboration Hub',
      description: 'Full-duplex group channels and direct messaging platform powered by WebSockets, STOMP protocol, and responsive Angular UI.',
      skills: ['Angular', 'Spring Boot', 'WebSockets', 'SQL', 'Bootstrap/CSS'],
      difficulty: 'Intermediate',
      duration: '3 weeks',
      category: 'Full Stack',
      icon: 'message-square',
      features: [
        'STOMP over WebSocket Real-Time Message Exchange',
        'Online User Presence & Typing Indicators',
        'Message History Pagination with Cursor Pagination',
        'Channel Creation with Password Protection'
      ]
    }
  ];

  public getProjects(): Observable<RecommendedProject[]> {
    return of(this.projects);
  }

  public getProjectById(id: string): RecommendedProject | undefined {
    return this.projects.find(p => p.id === id);
  }
}
