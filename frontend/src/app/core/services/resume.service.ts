import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { ResumeAnalysisResult } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private defaultResult: ResumeAnalysisResult = {
    score: 78,
    categories: {
      skills: 82,
      projects: 85,
      formatting: 90,
      keywords: 65,
      experience: 70
    },
    strengths: [
      'Clean formatting with standard ATS-friendly single-column layout',
      'Strong project section with clear technical stack breakdown',
      'Solid foundational competencies listed in Java, OOP, and Relational SQL',
      'Proper educational pedigree with GPA and relevant coursework'
    ],
    suggestions: [
      'Add more measurable impact metrics (e.g., "optimized SQL queries reducing response time by 40%")',
      'Improve ATS keyword density for Cloud deployment and containerization tools',
      'Add specific Spring Boot annotations and keywords (e.g., @RestController, Spring Security, Hibernate)',
      'Include links to live project demos alongside GitHub repositories'
    ],
    foundKeywords: [
      'Java', 'OOP', 'Spring Boot', 'Angular', 'SQL', 'Git', 'REST API', 'MySQL', 'HTML/CSS'
    ],
    missingKeywords: [
      'Docker', 'AWS', 'Microservices', 'Spring Security', 'JWT', 'CI/CD Pipeline', 'Redis', 'Kafka'
    ]
  };

  public analyzeResume(fileName: string): Observable<ResumeAnalysisResult> {
    // Simulates an ATS parsing delay
    return of(this.defaultResult).pipe(delay(1200));
  }

  public getMockResult(): ResumeAnalysisResult {
    return this.defaultResult;
  }
}
