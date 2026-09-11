import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { JobMatchResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class JobAnalyzerService {
  private defaultResult: JobMatchResult = {
    matchPercentage: 72,
    matchingSkills: ['Java', 'Spring Boot', 'SQL', 'Git', 'REST API', 'Angular'],
    missingSkills: ['Docker', 'AWS', 'Microservices', 'Spring Security', 'Kafka'],
    recommendedLearning: [
      {
        priority: 1,
        title: 'Docker & Containerization Fundamentals',
        description: 'Learn how to containerize Spring Boot and Angular apps, construct multi-stage Dockerfiles, and compose multi-container stacks.'
      },
      {
        priority: 2,
        title: 'Microservices Architecture & Communication',
        description: 'Understand service discovery (Eureka), API gateways (Spring Cloud Gateway), distributed tracing, and asynchronous event streaming.'
      },
      {
        priority: 3,
        title: 'AWS Cloud Deployment (EC2, ECS, RDS)',
        description: 'Deploy Spring Boot containers to AWS ECS with managed RDS PostgreSQL database instances and secure IAM configurations.'
      }
    ]
  };

  public sampleJDs: { title: string; company: string; text: string }[] = [
    {
      title: 'Full Stack Java Developer',
      company: 'TechCorp Global Solutions',
      text: `We are looking for a motivated Full Stack Java Developer to build our next-generation enterprise fintech platform.

Key Responsibilities:
- Design and develop robust server-side microservices using Java 17+ and Spring Boot.
- Create responsive and modular user interfaces using Angular 16+ with TypeScript.
- Write efficient SQL queries, store procedures, and optimize database schemas in PostgreSQL.
- Implement automated unit and integration tests with JUnit and Mockito.
- Deploy applications in containerized Docker environments running on AWS.

Requirements:
- Strong proficiency in Java, Object-Oriented Programming, and Data Structures.
- Hands-on experience with Spring Boot, Spring Data JPA, and RESTful APIs.
- Experience with modern Angular and reactive frontend principles.
- Familiarity with Docker, Microservices architecture, and AWS cloud basics.
- Version control proficiency with Git & GitHub.`
    },
    {
      title: 'Backend Software Engineer (Java/Spring)',
      company: 'CloudScale Innovations',
      text: `CloudScale is hiring a Junior to Mid Backend Engineer to join our distributed infrastructure team.

What You'll Do:
- Build high-throughput REST APIs and message queue consumers using Spring Boot and Kafka.
- Maintain and improve MySQL and Redis caching layers for sub-millisecond response latency.
- Containerize services with Docker and deploy to Kubernetes clusters.

Required Skills:
- 1-3 years of Java development experience.
- Deep familiarity with Spring Boot ecosystem.
- Knowledge of relational databases (MySQL, PostgreSQL) and SQL tuning.
- Understanding of containerization (Docker) and CI/CD pipelines.`
    },
    {
      title: 'Associate Full Stack Engineer',
      company: 'Apex Digital Labs',
      text: `Join our agile engineering team developing cutting-edge student learning systems and analytics tools.

Requirements:
- Strong Java, HTML5, CSS3, and JavaScript/TypeScript foundation.
- Practical experience with Angular framework and component-based UI.
- Experience building RESTful Web Services in Spring Boot.
- Good understanding of Git workflows and database fundamentals.`
    }
  ];

  public analyzeJobDescription(jdText: string): Observable<JobMatchResult> {
    const textLower = jdText.toLowerCase();

    // Check skills dynamically
    const skillChecks: { name: string; keywords: string[] }[] = [
      { name: 'Java', keywords: ['java'] },
      { name: 'Spring Boot', keywords: ['spring', 'spring boot'] },
      { name: 'Angular', keywords: ['angular'] },
      { name: 'SQL', keywords: ['sql', 'postgres', 'mysql'] },
      { name: 'Git', keywords: ['git', 'github'] },
      { name: 'REST API', keywords: ['rest', 'api', 'endpoints'] },
      { name: 'Docker', keywords: ['docker', 'container'] },
      { name: 'AWS', keywords: ['aws', 'cloud', 's3', 'ec2'] },
      { name: 'Microservices', keywords: ['microservices', 'micro-services'] },
      { name: 'Kafka', keywords: ['kafka', 'message queue'] },
      { name: 'Spring Security', keywords: ['security', 'jwt', 'auth'] }
    ];

    const studentKnown = ['Java', 'Spring Boot', 'Angular', 'SQL', 'Git', 'REST API'];
    const matching: string[] = [];
    const missing: string[] = [];

    skillChecks.forEach(s => {
      const isMentioned = s.keywords.some(k => textLower.includes(k));
      if (isMentioned) {
        if (studentKnown.includes(s.name)) {
          matching.push(s.name);
        } else {
          missing.push(s.name);
        }
      }
    });

    // Fallbacks if user entered custom text with few matches
    if (matching.length === 0 && missing.length === 0) {
      return of(this.defaultResult).pipe(delay(800));
    }

    const total = matching.length + missing.length;
    const matchPercentage = total > 0 ? Math.round((matching.length / total) * 100) : 70;

    return of({
      matchPercentage: Math.max(45, Math.min(92, matchPercentage)),
      matchingSkills: matching.length > 0 ? matching : this.defaultResult.matchingSkills,
      missingSkills: missing.length > 0 ? missing : this.defaultResult.missingSkills,
      recommendedLearning: this.defaultResult.recommendedLearning
    }).pipe(delay(800));
  }
}
