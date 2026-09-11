import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CareerGoal } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CareerService {
  private careerGoals: CareerGoal[] = [
    {
      id: 'java-fullstack',
      title: 'Java Full Stack Developer',
      description: 'Design and build end-to-end enterprise web applications using modern Java, Spring Boot, Angular, and cloud databases.',
      icon: 'code-xml',
      demandLevel: 'Very High',
      category: 'Full Stack',
      requiredSkills: [
        'Java', 'OOP', 'Collections', 'Spring Boot', 'REST API',
        'Spring Security', 'Hibernate/JPA', 'Angular', 'SQL',
        'Git', 'Docker', 'AWS'
      ]
    },
    {
      id: 'python-fullstack',
      title: 'Python Full Stack Developer',
      description: 'Build data-driven web apps with Python, Django/FastAPI, PostgreSQL, React/Angular, and automated CI/CD pipelines.',
      icon: 'terminal',
      demandLevel: 'High',
      category: 'Full Stack',
      requiredSkills: [
        'Python', 'FastAPI/Django', 'PostgreSQL', 'JavaScript/TypeScript',
        'React', 'REST APIs', 'Docker', 'AWS', 'Redis', 'Git'
      ]
    },
    {
      id: 'frontend-dev',
      title: 'Frontend Developer',
      description: 'Craft responsive, intuitive user interfaces and accessible web experiences using modern TypeScript, Angular, and CSS architecture.',
      icon: 'layout',
      demandLevel: 'Very High',
      category: 'Frontend',
      requiredSkills: [
        'HTML5/CSS3', 'JavaScript (ES6+)', 'TypeScript', 'Angular',
        'RxJS', 'Responsive Design', 'REST API Integration', 'Testing/Jest', 'Git'
      ]
    },
    {
      id: 'backend-dev',
      title: 'Backend Developer',
      description: 'Architect scalable server-side systems, microservices, secure authentication, and high-performance databases.',
      icon: 'server',
      demandLevel: 'Very High',
      category: 'Backend',
      requiredSkills: [
        'Java/Node.js', 'Spring Boot/Express', 'Microservices', 'PostgreSQL/MySQL',
        'Redis', 'Kafka', 'Docker', 'REST & gRPC APIs', 'Cloud (AWS)'
      ]
    },
    {
      id: 'data-analyst',
      title: 'Data Analyst',
      description: 'Extract business insights from complex data sets using statistical analysis, SQL querying, and interactive dashboards.',
      icon: 'bar-chart-2',
      demandLevel: 'High',
      category: 'Data',
      requiredSkills: [
        'SQL', 'Python', 'Excel Advanced', 'Tableau / PowerBI',
        'Statistics', 'Data Cleansing', 'Storytelling'
      ]
    },
    {
      id: 'data-scientist',
      title: 'Data Scientist',
      description: 'Build predictive machine learning models, neural networks, and automated intelligence pipelines from big data.',
      icon: 'brain',
      demandLevel: 'High',
      category: 'Data & AI',
      requiredSkills: [
        'Python', 'Machine Learning', 'Pandas & NumPy', 'Scikit-Learn',
        'Deep Learning', 'Feature Engineering', 'SQL', 'MLOps'
      ]
    },
    {
      id: 'devops-engineer',
      title: 'DevOps Engineer',
      description: 'Automate build, deployment, and infrastructure reliability with Docker, Kubernetes, CI/CD pipelines, and Infrastructure as Code.',
      icon: 'cpu',
      demandLevel: 'Very High',
      category: 'DevOps & Cloud',
      requiredSkills: [
        'Linux Administration', 'Docker', 'Kubernetes', 'GitHub Actions/Jenkins',
        'Terraform', 'AWS/Azure', 'Prometheus & Grafana', 'Bash/Python'
      ]
    },
    {
      id: 'cloud-engineer',
      title: 'Cloud Engineer',
      description: 'Design robust multi-region cloud architectures, serverless microservices, and identity management on AWS or Azure.',
      icon: 'cloud',
      demandLevel: 'High',
      category: 'Cloud',
      requiredSkills: [
        'AWS Solutions Architecture', 'IAM & Cloud Security', 'Serverless/Lambda',
        'Networking & VPC', 'Terraform', 'Docker', 'CloudWatch'
      ]
    },
    {
      id: 'aiml-engineer',
      title: 'AI/ML Engineer',
      description: 'Deploy generative AI models, fine-tune LLMs, build RAG pipelines, and integrate AI services into scalable products.',
      icon: 'sparkles',
      demandLevel: 'Very High',
      category: 'Data & AI',
      requiredSkills: [
        'Python', 'PyTorch/TensorFlow', 'LLMs & LangChain', 'Vector DBs (Pinecone/Milvus)',
        'FastAPI', 'Docker', 'Cloud AI (Bedrock/OpenAI)', 'MLOps'
      ]
    },
    {
      id: 'mobile-dev',
      title: 'Mobile App Developer',
      description: 'Create cross-platform or native mobile apps with smooth 60fps animations, offline storage, and cloud synchronization.',
      icon: 'smartphone',
      demandLevel: 'Moderate',
      category: 'Mobile',
      requiredSkills: [
        'Flutter / React Native', 'Kotlin / Swift', 'Mobile UI/UX Design',
        'State Management', 'REST API Integration', 'SQLite/Firebase', 'App Store Publishing'
      ]
    }
  ];

  public getCareerGoals(): Observable<CareerGoal[]> {
    return of(this.careerGoals);
  }

  public getCareerGoalById(id: string): CareerGoal | undefined {
    return this.careerGoals.find(g => g.id === id);
  }
}
