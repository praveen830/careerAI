/**
 * mock-data/progress.ts
 * Student learning progress data.
 * Replace with GET /api/progress when backend is ready.
 */

export interface WeeklyActivity {
  day: string;
  hours: number;
  date: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export const MOCK_WEEKLY_ACTIVITY: WeeklyActivity[] = [
  { day: 'Mon', hours: 2.5, date: 'Sep 03' },
  { day: 'Tue', hours: 1.8, date: 'Sep 04' },
  { day: 'Wed', hours: 3.2, date: 'Sep 05' },
  { day: 'Thu', hours: 2.0, date: 'Sep 06' },
  { day: 'Fri', hours: 2.8, date: 'Sep 07' },
  { day: 'Sat', hours: 4.5, date: 'Sep 08' },
  { day: 'Sun', hours: 1.5, date: 'Sep 09' },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    title: 'First Skill Added',
    description: 'You added your very first skill to your profile.',
    icon: '🌟',
    unlocked: true,
    unlockedDate: 'Aug 10, 2026',
  },
  {
    id: 'a2',
    title: 'Goal Setter',
    description: 'You selected your first career goal.',
    icon: '🎯',
    unlocked: true,
    unlockedDate: 'Aug 11, 2026',
  },
  {
    id: 'a3',
    title: 'First Project Completed',
    description: 'You completed your first recommended project.',
    icon: '🚀',
    unlocked: true,
    unlockedDate: 'Aug 25, 2026',
  },
  {
    id: 'a4',
    title: '5 Skills Improved',
    description: 'You improved proficiency in 5 different skills.',
    icon: '💪',
    unlocked: true,
    unlockedDate: 'Sep 01, 2026',
  },
  {
    id: 'a5',
    title: '7-Day Streak',
    description: 'You learned something new 7 days in a row!',
    icon: '🔥',
    unlocked: true,
    unlockedDate: 'Sep 09, 2026',
  },
  {
    id: 'a6',
    title: 'Roadmap 40% Complete',
    description: 'You completed 40% of your learning roadmap.',
    icon: '🗺️',
    unlocked: true,
    unlockedDate: 'Sep 07, 2026',
  },
  {
    id: 'a7',
    title: 'Resume Analyzer',
    description: 'You analyzed your resume for the first time.',
    icon: '📄',
    unlocked: false,
  },
  {
    id: 'a8',
    title: 'Job Ready 80%',
    description: 'Reach 80% career readiness score.',
    icon: '💼',
    unlocked: false,
  },
  {
    id: 'a9',
    title: '30-Day Streak',
    description: 'Maintain a 30-day learning streak.',
    icon: '⚡',
    unlocked: false,
  },
];
