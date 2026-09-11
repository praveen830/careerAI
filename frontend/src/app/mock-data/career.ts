/**
 * mock-data/career.ts
 * Available career goals/tracks.
 * Replace with GET /api/careers when backend is ready.
 */
import { CareerGoal } from '../core/models';

export const MOCK_CAREER_GOALS: CareerGoal[] = [
  {
    id: 'python-fullstack',
    title: 'Python Full Stack Developer',
    description: 'Build robust web applications with Python, Django/FastAPI on the backend, modern frontend frameworks, and cloud databases.',
    icon: '🐍',
    demandLevel: 'Very High',
    category: 'Full Stack',
    requiredSkills: ['Python', 'Django / FastAPI', 'PostgreSQL', 'React/Angular', 'REST APIs', 'Docker', 'Redis', 'Git'],
  },
  {
    id: 'java-fullstack',
    title: 'Java Full Stack Developer',
    description: 'Build enterprise-grade applications using Java, Spring Boot on the backend and Angular on the frontend.',
    icon: '☕',
    demandLevel: 'Very High',
    category: 'Full Stack',
    requiredSkills: ['Java', 'Spring Boot', 'Spring Security', 'REST API', 'Angular', 'MySQL', 'Docker', 'Git'],
  },
  {
    id: 'frontend-dev',
    title: 'Frontend Developer',
    description: 'Create stunning, responsive user interfaces using Angular, React, and modern CSS techniques.',
    icon: '🎨',
    demandLevel: 'Very High',
    category: 'Frontend',
    requiredSkills: ['Angular/React', 'HTML/CSS', 'JavaScript', 'TypeScript', 'REST API', 'Git'],
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description: 'Extract insights from large datasets using Python, SQL, and visualization tools.',
    icon: '📊',
    demandLevel: 'High',
    category: 'Data',
    requiredSkills: ['Python', 'SQL', 'Excel', 'Tableau/Power BI', 'Statistics', 'Pandas'],
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI/ML Engineer',
    description: 'Design and deploy machine learning models and intelligent systems.',
    icon: '🤖',
    demandLevel: 'Very High',
    category: 'AI/ML',
    requiredSkills: ['Python', 'TensorFlow/PyTorch', 'ML Algorithms', 'Statistics', 'Data Preprocessing', 'Cloud (AWS/GCP)'],
  },
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description: 'Automate CI/CD pipelines and manage cloud infrastructure for continuous delivery.',
    icon: '⚙️',
    demandLevel: 'High',
    category: 'DevOps',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS/Azure', 'CI/CD', 'Linux', 'Terraform', 'Git'],
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    description: 'Design scalable server-side APIs and microservices using Java, Node.js, or Python.',
    icon: '🔧',
    demandLevel: 'Very High',
    category: 'Backend',
    requiredSkills: ['Java/Node.js', 'REST APIs', 'Databases', 'Spring Boot', 'Microservices', 'Docker'],
  },
];
