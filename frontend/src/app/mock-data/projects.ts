/**
 * mock-data/projects.ts
 * Recommended projects for the student based on their skill gaps.
 * Replace with GET /api/projects when backend is ready.
 */
import { RecommendedProject } from '../core/models';

export const MOCK_PROJECTS: RecommendedProject[] = [
  {
    id: 'p1',
    title: 'Student Management System',
    description: 'A full-featured CRUD application to manage student records, grades, courses, and attendance.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'REST API', 'JPA/Hibernate'],
    difficulty: 'Intermediate',
    duration: '2–3 weeks',
    category: 'Backend',
    icon: '🎓',
    features: ['Student CRUD', 'Course enrollment', 'Grade tracking', 'REST endpoints', 'Swagger docs'],
  },
  {
    id: 'p2',
    title: 'Secure Task Manager API',
    description: 'A task management backend with Spring Security, JWT authentication, and role-based access control.',
    skills: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'MySQL'],
    difficulty: 'Intermediate',
    duration: '2–3 weeks',
    category: 'Backend',
    icon: '🔐',
    features: ['JWT authentication', 'Role-based access', 'Task CRUD', 'User management', 'API security'],
  },
  {
    id: 'p3',
    title: 'E-Commerce Platform',
    description: 'Full-stack online store with product catalog, cart, orders, and payment simulation.',
    skills: ['Angular', 'Spring Boot', 'JWT', 'MySQL', 'REST API'],
    difficulty: 'Advanced',
    duration: '4–6 weeks',
    category: 'Full Stack',
    icon: '🛒',
    features: ['Product catalog', 'Shopping cart', 'User auth', 'Order management', 'Admin dashboard'],
  },
  {
    id: 'p4',
    title: 'Blog Platform',
    description: 'Full-stack blogging platform with Angular frontend, Spring Boot API, and MySQL storage.',
    skills: ['Angular', 'Spring Boot', 'MySQL', 'REST API'],
    difficulty: 'Intermediate',
    duration: '3–4 weeks',
    category: 'Full Stack',
    icon: '✍️',
    features: ['Post CRUD', 'Comments', 'Categories', 'Search', 'User profiles'],
  },
  {
    id: 'p5',
    title: 'Employee HR System',
    description: 'HR management system with employee records, department management, and attendance tracking.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Spring Security'],
    difficulty: 'Advanced',
    duration: '4–5 weeks',
    category: 'Backend',
    icon: '👔',
    features: ['Employee profiles', 'Department management', 'Salary calculation', 'Leave management', 'Reports'],
  },
  {
    id: 'p6',
    title: 'Containerized Microservices',
    description: 'Build and deploy a microservices application using Docker and basic Kubernetes concepts.',
    skills: ['Docker', 'Java', 'Spring Boot', 'REST API'],
    difficulty: 'Advanced',
    duration: '3–4 weeks',
    category: 'DevOps',
    icon: '🐳',
    features: ['Docker containers', 'Service communication', 'API Gateway', 'Config management', 'Health checks'],
  },
];
