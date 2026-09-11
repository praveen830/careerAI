/**
 * mock-data/student.ts
 * Central mock student profile used across all components.
 * Replace these values with real API calls when Spring Boot backend is ready.
 */
import { StudentProfile } from '../core/models';

export const MOCK_STUDENT: StudentProfile = {
  fullName: 'Praveen Kumar',
  email: 'praveen.dev@college.edu',
  college: 'GIET University',
  degree: 'B.Tech',
  currentYear: '3rd Year',
  graduationYear: '2027',
  location: 'Hyderabad, India',
  github: 'https://github.com/praveen-dev',
  linkedin: 'https://linkedin.com/in/praveen-kumar-dev',
  bio: 'Passionate Java developer focused on becoming a full-stack engineer. Building real-world projects to close skill gaps.',
  careerGoal: 'Java Full Stack Developer',
  readinessScore: 68,
  streakDays: 7,
  projectsCompleted: 3,
};
