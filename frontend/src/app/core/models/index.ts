export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type SkillStatus = 'Strong' | 'Needs Improvement' | 'Critical Gap';

export interface TechnicalSkill {
  id: string;
  name: string;
  proficiency: number; // 0 to 100
  level: SkillLevel;
  requiredForGoal?: number; // target %
  gap?: number;
  status: SkillStatus;
  category: string;
}

export interface StudentProfile {
  fullName: string;
  email: string;
  college: string;
  degree: string;
  currentYear: string;
  graduationYear: string;
  location: string;
  github: string;
  linkedin: string;
  bio: string;
  careerGoal: string;
  readinessScore: number;
  streakDays: number;
  projectsCompleted: number;
  avatarUrl?: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  icon: string;
  demandLevel: 'Very High' | 'High' | 'Moderate';
  category: string;
  requiredSkills: string[];
}

export interface RoadmapTopic {
  id: string;
  title: string;
  completed: boolean;
  concepts: string[];
}

export interface RoadmapStage {
  id: string;
  stageNumber: number;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  estimatedHours: string;
  description: string;
  topics: RoadmapTopic[];
}

export interface RecommendedProject {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  category: string;
  icon: string;
  features: string[];
}

export interface ResumeAnalysisResult {
  score: number;
  categories: {
    skills: number;
    projects: number;
    formatting: number;
    keywords: number;
    experience: number;
  };
  strengths: string[];
  suggestions: string[];
  foundKeywords: string[];
  missingKeywords: string[];
}

export interface JobMatchResult {
  matchPercentage: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendedLearning: {
    priority: number;
    title: string;
    description: string;
  }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  suggestedPrompts?: string[];
}

export interface AIChatRequest {
  message: string;
}

export interface ChatResponse {
  response: string;
  message?: string;
  suggestedPrompts?: string[];
}

export interface AuthUser {
  id?: string;
  email: string;
  fullName: string;
  college?: string;
  careerGoal?: string;
  readinessScore?: number;
  avatarUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface SkillOverviewItem {
  id: string;
  name: string;
  proficiency: number;
  status: 'Strong' | 'Needs Improvement' | 'Developing';
  colorClass: string;
}

export interface SkillGapHighlight {
  id: string;
  name: string;
  current: number;
  required: number;
  priority: 'Critical' | 'High' | 'Medium';
}

export interface NextStepRecommendation {
  title: string;
  description: string;
  estimatedTime: string;
  currentProgress: number;
  targetRole: string;
}

export interface RoadmapStepSummary {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  progress?: number;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  colorClass: string;
}

export interface SkillGapItem {
  skillName: string;
  requiredLevel: number;
  currentLevel: number;
  gapLevel: number;
  severity: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'CRITICAL' | string;
  // UI aliases for display convenience
  name?: string;
  proficiency?: number;
  category?: string;
}

export interface SkillGapResponse {
  careerGoal: string;
  readinessScore: number;
  skillGaps: SkillGapItem[];
}

export interface SkillGapRequest {
  careerGoal?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
