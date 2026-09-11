import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { RoadmapStage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  private stagesSubject = new BehaviorSubject<RoadmapStage[]>([
    {
      id: 'stg-1',
      stageNumber: 1,
      title: 'Java Fundamentals',
      status: 'completed',
      estimatedHours: '30 hrs',
      description: 'Master core syntax, primitive types, control flow, loops, and basic memory management in JVM.',
      topics: [
        { id: 't-1-1', title: 'Data Types, Operators & Variables', completed: true, concepts: ['Primitives vs References', 'Type Casting', 'Scope'] },
        { id: 't-1-2', title: 'Control Flow & Conditionals', completed: true, concepts: ['if-else', 'switch-case', 'ternary operator'] },
        { id: 't-1-3', title: 'Loops & Iteration', completed: true, concepts: ['for-loop', 'enhanced for', 'while & do-while'] },
        { id: 't-1-4', title: 'Methods, Parameters & Return Types', completed: true, concepts: ['Method Overloading', 'Pass by Value', 'Recursion'] }
      ]
    },
    {
      id: 'stg-2',
      stageNumber: 2,
      title: 'OOP & Collections Framework',
      status: 'completed',
      estimatedHours: '45 hrs',
      description: 'Grasp deep Object-Oriented principles, dynamic polymorphism, and standard Java Collection interfaces.',
      topics: [
        { id: 't-2-1', title: 'Encapsulation & Abstraction', completed: true, concepts: ['Access Modifiers', 'Abstract Classes', 'Interfaces'] },
        { id: 't-2-2', title: 'Inheritance & Polymorphism', completed: true, concepts: ['Method Overriding', 'super & this', 'Dynamic Dispatch'] },
        { id: 't-2-3', title: 'Collections: List, Set, Queue', completed: true, concepts: ['ArrayList vs LinkedList', 'HashSet', 'TreeSet'] },
        { id: 't-2-4', title: 'Maps & HashCode/Equals Contract', completed: true, concepts: ['HashMap internals', 'Collision handling', 'ConcurrentHashMap'] }
      ]
    },
    {
      id: 'stg-3',
      stageNumber: 3,
      title: 'Advanced Java & Modern Java 17+',
      status: 'in-progress',
      estimatedHours: '35 hrs',
      description: 'Modern Java functional features, lambdas, streams, records, sealed classes, and multi-threading.',
      topics: [
        { id: 't-3-1', title: 'Functional Interfaces & Lambdas', completed: true, concepts: ['Predicate', 'Function', 'Consumer', 'Supplier'] },
        { id: 't-3-2', title: 'Stream API & Collectors', completed: true, concepts: ['map, filter, reduce', 'parallel streams', 'groupingBy'] },
        { id: 't-3-3', title: 'Concurrency & Thread Pools', completed: false, concepts: ['ExecutorService', 'CompletableFuture', 'Virtual Threads'] },
        { id: 't-3-4', title: 'Exception Handling & Custom Exceptions', completed: true, concepts: ['Checked vs Unchecked', 'try-with-resources'] }
      ]
    },
    {
      id: 'stg-4',
      stageNumber: 4,
      title: 'Spring Boot Basics & Data JPA',
      status: 'upcoming',
      estimatedHours: '50 hrs',
      description: 'Learn Inversion of Control, Dependency Injection, Hibernate entity mapping, and automated database persistence.',
      topics: [
        { id: 't-4-1', title: 'Spring Core & IoC / DI', completed: false, concepts: ['@Component', '@Service', '@Autowired', 'Bean Lifecycle'] },
        { id: 't-4-2', title: 'Spring Boot Starters & Auto-configuration', completed: false, concepts: ['application.yml', 'Profiles', 'Actuator'] },
        { id: 't-4-3', title: 'Spring Data JPA & Hibernate', completed: false, concepts: ['Entities', '@OneToMany', 'Repositories', 'JPQL'] },
        { id: 't-4-4', title: 'Database Migrations with Flyway', completed: false, concepts: ['Schema Versioning', 'Rollbacks', 'Audit Trails'] }
      ]
    },
    {
      id: 'stg-5',
      stageNumber: 5,
      title: 'REST APIs & Web Services',
      status: 'upcoming',
      estimatedHours: '40 hrs',
      description: 'Construct resilient RESTful endpoints, request validation, global exception handlers, and API docs with OpenAPI.',
      topics: [
        { id: 't-5-1', title: 'RESTful Architecture & HTTP Methods', completed: false, concepts: ['GET, POST, PUT, DELETE', 'HTTP Status Codes', 'Idempotence'] },
        { id: 't-5-2', title: 'Request Validation & Error Handling', completed: false, concepts: ['@Valid', '@RestControllerAdvice', 'ProblemDetail'] },
        { id: 't-5-3', title: 'DTO Pattern & ModelMapper/MapStruct', completed: false, concepts: ['Decoupling Entities', 'Mapper Generation'] },
        { id: 't-5-4', title: 'Swagger / OpenAPI 3 Documentation', completed: false, concepts: ['Interactive API testing', 'API Schema generation'] }
      ]
    },
    {
      id: 'stg-6',
      stageNumber: 6,
      title: 'Spring Security & JWT Authentication',
      status: 'upcoming',
      estimatedHours: '35 hrs',
      description: 'Implement stateless security filters, token generation, role-based access control, and password encryption.',
      topics: [
        { id: 't-6-1', title: 'SecurityFilterChain & Filter Architecture', completed: false, concepts: ['UsernamePasswordFilter', 'SecurityContext'] },
        { id: 't-6-2', title: 'JWT Token Generation & Validation', completed: false, concepts: ['Claims', 'Signing Keys', 'Expiration & Refresh'] },
        { id: 't-6-3', title: 'Role-Based Access Control (RBAC)', completed: false, concepts: ['@PreAuthorize', 'GrantedAuthority', 'Permissions'] },
        { id: 't-6-4', title: 'CORS & CSRF Protection', completed: false, concepts: ['Allowed Origins', 'Header Security', 'Stateless APIs'] }
      ]
    },
    {
      id: 'stg-7',
      stageNumber: 7,
      title: 'Angular Frontend Integration',
      status: 'upcoming',
      estimatedHours: '45 hrs',
      description: 'Connect client-side Angular single page apps with backend REST endpoints, reactive forms, and route guards.',
      topics: [
        { id: 't-7-1', title: 'Standalone Components & Routing', completed: false, concepts: ['RouterOutlet', 'Lazy Loading', 'Child Routes'] },
        { id: 't-7-2', title: 'RxJS Observables & HttpClient', completed: false, concepts: ['pipe, map, catchError', 'HttpInterceptors for JWT'] },
        { id: 't-7-3', title: 'Reactive Forms & Custom Validators', completed: false, concepts: ['FormBuilder', 'Async Validation', 'FormGroup'] },
        { id: 't-7-4', title: 'AuthGuards & Route Protection', completed: false, concepts: ['canActivate', 'Token Redirection'] }
      ]
    },
    {
      id: 'stg-8',
      stageNumber: 8,
      title: 'Docker & Containerization',
      status: 'upcoming',
      estimatedHours: '25 hrs',
      description: 'Containerize both Spring Boot JARs and Angular Nginx builds with multi-stage Dockerfiles and Docker Compose.',
      topics: [
        { id: 't-8-1', title: 'Docker Images, Containers & Registries', completed: false, concepts: ['Docker CLI', 'Layers', 'Docker Hub'] },
        { id: 't-8-2', title: 'Multi-stage Dockerfile for Java & Angular', completed: false, concepts: ['Build stage vs Runtime', 'Minimal Alpine images'] },
        { id: 't-8-3', title: 'Docker Compose for Full Stack Local Dev', completed: false, concepts: ['Postgres service', 'Networks & Volumes', 'Env files'] },
        { id: 't-8-4', title: 'Container Networking & Health Checks', completed: false, concepts: ['DNS Resolution', 'Restart policies'] }
      ]
    },
    {
      id: 'stg-9',
      stageNumber: 9,
      title: 'AWS Deployment & CI/CD',
      status: 'upcoming',
      estimatedHours: '30 hrs',
      description: 'Automate build pipelines with GitHub Actions and deploy containers to AWS ECS/Elastic Beanstalk with RDS PostgreSQL.',
      topics: [
        { id: 't-9-1', title: 'GitHub Actions Continuous Integration', completed: false, concepts: ['Automated Testing', 'Docker Build & Push'] },
        { id: 't-9-2', title: 'AWS RDS Database Configuration', completed: false, concepts: ['Managed Postgres/MySQL', 'VPC Subnets', 'Security Groups'] },
        { id: 't-9-3', title: 'AWS Elastic Beanstalk / ECS Deployment', completed: false, concepts: ['Load Balancing', 'Auto Scaling', 'App Runner'] },
        { id: 't-9-4', title: 'Custom Domain & SSL with CloudFront/Route53', completed: false, concepts: ['HTTPS Termination', 'CDN Edge Caching'] }
      ]
    }
  ]);

  public stages$: Observable<RoadmapStage[]> = this.stagesSubject.asObservable();

  public overallProgress$: Observable<number> = this.stages$.pipe(
    map(stages => {
      let totalTopics = 0;
      let completedTopics = 0;
      stages.forEach(stage => {
        stage.topics.forEach(topic => {
          totalTopics++;
          if (topic.completed) completedTopics++;
        });
      });
      return totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    })
  );

  public loadRoadmapForGoal(goalTitle: string): void {
    const lower = (goalTitle || '').toLowerCase();
    
    if (lower.includes('frontend')) {
      this.stagesSubject.next([
        {
          id: 'fe-stg-1',
          stageNumber: 1,
          title: 'HTML5 Semantic Markup & Modern CSS3',
          status: 'completed',
          estimatedHours: '25 hrs',
          description: 'Master semantic web architecture, accessibility (a11y), CSS Grid, Flexbox, and modern CSS custom properties.',
          topics: [
            { id: 'fe-t-1-1', title: 'Semantic Elements & SEO Foundations', completed: true, concepts: ['header, nav, main, article', 'ARIA roles', 'SEO meta'] },
            { id: 'fe-t-1-2', title: 'CSS Grid & Flexbox Deep Dive', completed: true, concepts: ['Grid templates', 'Flex alignment', 'Subgrid'] },
            { id: 'fe-t-1-3', title: 'Responsive Breakpoints & Fluid Typography', completed: true, concepts: ['clamp()', 'Container Queries', 'Mobile-first'] },
            { id: 'fe-t-1-4', title: 'CSS Variables & Modern Theming', completed: true, concepts: ['HSL color palettes', 'Dark mode transitions'] }
          ]
        },
        {
          id: 'fe-stg-2',
          stageNumber: 2,
          title: 'Modern JavaScript (ES6+) & Async Programming',
          status: 'completed',
          estimatedHours: '35 hrs',
          description: 'Deep dive into event loop, closures, promises, async/await, DOM manipulation, and ES modules.',
          topics: [
            { id: 'fe-t-2-1', title: 'Closures, Scope & Prototypal Inheritance', completed: true, concepts: ['Lexical scoping', 'Prototypes', 'Memory management'] },
            { id: 'fe-t-2-2', title: 'Promises, Async/Await & Fetch API', completed: true, concepts: ['Promise.all', 'Error boundaries', 'AbortController'] },
            { id: 'fe-t-2-3', title: 'DOM Events, Bubbling & Delegation', completed: true, concepts: ['Event bubbling', 'Custom events', 'IntersectionObserver'] },
            { id: 'fe-t-2-4', title: 'Modern ES Modules & Bundlers', completed: true, concepts: ['Vite, Webpack', 'Tree shaking', 'Dynamic imports'] }
          ]
        },
        {
          id: 'fe-stg-3',
          stageNumber: 3,
          title: 'TypeScript for Scalable Applications',
          status: 'in-progress',
          estimatedHours: '30 hrs',
          description: 'Type safety, generics, utility types, mapped types, and strict compiler configurations.',
          topics: [
            { id: 'fe-t-3-1', title: 'Types, Interfaces & Type Unions', completed: true, concepts: ['Discriminated unions', 'Type aliases', 'Type narrowing'] },
            { id: 'fe-t-3-2', title: 'Generics & Utility Types', completed: true, concepts: ['Partial, Pick, Omit', 'keyof & typeof', 'Generic constraints'] },
            { id: 'fe-t-3-3', title: 'Advanced Typing: Conditional & Template Literal Types', completed: false, concepts: ['Infer keyword', 'DeepReadonly', 'Pattern matching'] },
            { id: 'fe-t-3-4', title: 'TypeScript with Modern Web Frameworks', completed: false, concepts: ['Strict null checks', 'tsconfig presets'] }
          ]
        },
        {
          id: 'fe-stg-4',
          stageNumber: 4,
          title: 'Angular Architecture, Signals & Standalone Components',
          status: 'in-progress',
          estimatedHours: '45 hrs',
          description: 'Modern Angular 17+ standalone architecture, signals reactivity, control flow syntax, and routing.',
          topics: [
            { id: 'fe-t-4-1', title: 'Standalone Components & Control Flow (@if/@for)', completed: true, concepts: ['Direct imports', 'New template control flow', 'Defer blocks'] },
            { id: 'fe-t-4-2', title: 'Signals: signal(), computed(), effect()', completed: true, concepts: ['Fine-grained reactivity', 'Signal inputs & outputs'] },
            { id: 'fe-t-4-3', title: 'Dependency Injection & Hierarchical Injectors', completed: false, concepts: ['inject() function', 'providedIn root', 'Factory providers'] },
            { id: 'fe-t-4-4', title: 'Component Routing & Lazy Loading', completed: false, concepts: ['loadComponent', 'Resolve guards', 'Route transitions'] }
          ]
        },
        {
          id: 'fe-stg-5',
          stageNumber: 5,
          title: 'RxJS Streams, Reactive Forms & HTTP Interceptors',
          status: 'upcoming',
          estimatedHours: '40 hrs',
          description: 'Complex reactive event streaming, declarative data handling with RxJS, and clean HTTP architectures.',
          topics: [
            { id: 'fe-t-5-1', title: 'RxJS Core Operators: switchMap, mergeMap, catchError', completed: false, concepts: ['Higher-order mapping', 'Stream cancellation', 'Retry strategies'] },
            { id: 'fe-t-5-2', title: 'Reactive Forms & Custom Async Validators', completed: false, concepts: ['FormBuilder', 'Dynamic FormArrays', 'Cross-field validation'] },
            { id: 'fe-t-5-3', title: 'Functional HTTP Interceptors & Token Auth', completed: false, concepts: ['HttpInterceptorFn', 'Authorization headers', 'Refresh token flow'] },
            { id: 'fe-t-5-4', title: 'State Management with NgRx or Signals Store', completed: false, concepts: ['Single source of truth', 'Reducers', 'Effects'] }
          ]
        },
        {
          id: 'fe-stg-6',
          stageNumber: 6,
          title: 'Testing, Performance Optimization & CI/CD Deployment',
          status: 'upcoming',
          estimatedHours: '30 hrs',
          description: 'Automate unit tests with Jest, end-to-end tests with Cypress, optimize Lighthouse scores, and deploy to Vercel/AWS.',
          topics: [
            { id: 'fe-t-6-1', title: 'Unit & Component Testing with Jest / Karma', completed: false, concepts: ['TestBed', 'ComponentFixture', 'Mocking services'] },
            { id: 'fe-t-6-2', title: 'E2E Testing with Playwright or Cypress', completed: false, concepts: ['User interaction flows', 'Visual regression testing'] },
            { id: 'fe-t-6-3', title: 'Core Web Vitals & Bundle Size Reduction', completed: false, concepts: ['LCP, FID, CLS', 'Image optimization', 'Code splitting'] },
            { id: 'fe-t-6-4', title: 'Automated CI/CD Deployment via GitHub Actions', completed: false, concepts: ['Build verification', 'Cloudflare Pages / AWS S3 deployment'] }
          ]
        }
      ]);
    } else if (lower.includes('data') || lower.includes('analyst')) {
      this.stagesSubject.next([
        {
          id: 'da-stg-1',
          stageNumber: 1,
          title: 'Advanced Excel & Analytical Foundations',
          status: 'completed',
          estimatedHours: '20 hrs',
          description: 'Master lookup formulas, pivot tables, dynamic arrays, and statistical summary modeling.',
          topics: [
            { id: 'da-t-1-1', title: 'XLOOKUP, INDEX/MATCH & Nested Logics', completed: true, concepts: ['Dynamic array formulas', 'Data validation'] },
            { id: 'da-t-1-2', title: 'Pivot Tables, Slicers & Power Query ETL', completed: true, concepts: ['Data reshaping', 'Calculated fields'] },
            { id: 'da-t-1-3', title: 'Statistical Modeling in Spreadsheets', completed: true, concepts: ['Standard deviation', 'Correlation analysis'] }
          ]
        },
        {
          id: 'da-stg-2',
          stageNumber: 2,
          title: 'SQL for Data Extraction & Complex Analysis',
          status: 'completed',
          estimatedHours: '35 hrs',
          description: 'Write performant multi-table joins, subqueries, CTEs, and analytic window functions.',
          topics: [
            { id: 'da-t-2-1', title: 'Multi-Table Joins & Aggregations', completed: true, concepts: ['LEFT, INNER, FULL OUTER', 'GROUP BY, HAVING'] },
            { id: 'da-t-2-2', title: 'Window Functions: ROW_NUMBER, RANK, LEAD/LAG', completed: true, concepts: ['PARTITION BY', 'Rolling averages', 'Percentiles'] },
            { id: 'da-t-2-3', title: 'Common Table Expressions (CTEs) & Subqueries', completed: true, concepts: ['Recursive queries', 'Query optimization'] }
          ]
        },
        {
          id: 'da-stg-3',
          stageNumber: 3,
          title: 'Python for Data Analysis (Pandas & NumPy)',
          status: 'in-progress',
          estimatedHours: '40 hrs',
          description: 'Automate data cleaning, outlier detection, aggregations, and merge operations with Pandas.',
          topics: [
            { id: 'da-t-3-1', title: 'NumPy Arrays & Vectorized Calculations', completed: true, concepts: ['Broadcasting', 'Mathematical operations'] },
            { id: 'da-t-3-2', title: 'DataFrames, Indexing & Data Cleansing', completed: true, concepts: ['Handling nulls', 'Data type conversions'] },
            { id: 'da-t-3-3', title: 'Groupby, Reshaping & Pivot Operations', completed: false, concepts: ['MultiIndex', 'melt() and pivot_table()'] },
            { id: 'da-t-3-4', title: 'Time Series Analysis & Date Parsing', completed: false, concepts: ['Resampling', 'Rolling windows'] }
          ]
        },
        {
          id: 'da-stg-4',
          stageNumber: 4,
          title: 'Business Intelligence: Power BI & Tableau',
          status: 'upcoming',
          estimatedHours: '35 hrs',
          description: 'Design executive KPI dashboards, DAX measures, interactive filters, and data stories.',
          topics: [
            { id: 'da-t-4-1', title: 'Star Schema Data Modeling in Power BI', completed: false, concepts: ['Fact vs Dimension tables', 'Relationship cardinalities'] },
            { id: 'da-t-4-2', title: 'DAX Formulas & Calculated Columns', completed: false, concepts: ['CALCULATE()', 'Time intelligence DAX'] },
            { id: 'da-t-4-3', title: 'Interactive Dashboard UX & Visual Best Practices', completed: false, concepts: ['Color theory', 'Drill-through filters'] }
          ]
        }
      ]);
    } else if (lower.includes('ai') || lower.includes('ml')) {
      this.stagesSubject.next([
        {
          id: 'ai-stg-1',
          stageNumber: 1,
          title: 'Python, Math & Exploratory Data Analysis',
          status: 'completed',
          estimatedHours: '30 hrs',
          description: 'Linear algebra, calculus fundamentals, probability distributions, NumPy, and Matplotlib.',
          topics: [
            { id: 'ai-t-1-1', title: 'Vectors, Matrices & Eigenvalues in NumPy', completed: true, concepts: ['Dot products', 'Matrix inversion', 'Singular Value Decomposition'] },
            { id: 'ai-t-1-2', title: 'Probability Distributions & Hypothesis Testing', completed: true, concepts: ['Normal distribution', 'p-values', 'Bayes theorem'] },
            { id: 'ai-t-1-3', title: 'Data Preprocessing & Feature Scaling', completed: true, concepts: ['StandardScaler', 'One-hot encoding', 'Outlier removal'] }
          ]
        },
        {
          id: 'ai-stg-2',
          stageNumber: 2,
          title: 'Classic Machine Learning with Scikit-Learn',
          status: 'in-progress',
          estimatedHours: '40 hrs',
          description: 'Supervised & unsupervised learning, regression, decision trees, random forests, and XGBoost.',
          topics: [
            { id: 'ai-t-2-1', title: 'Linear & Logistic Regression', completed: true, concepts: ['Gradient descent', 'Cost functions', 'L1/L2 regularization'] },
            { id: 'ai-t-2-2', title: 'Tree Models & Ensemble Learning (Random Forest, XGBoost)', completed: true, concepts: ['Bagging vs Boosting', 'Hyperparameter tuning'] },
            { id: 'ai-t-2-3', title: 'Model Evaluation: ROC-AUC, F1-Score, Cross-Validation', completed: false, concepts: ['Confusion matrices', 'K-Fold CV'] }
          ]
        },
        {
          id: 'ai-stg-3',
          stageNumber: 3,
          title: 'Deep Learning & Neural Networks with PyTorch',
          status: 'upcoming',
          estimatedHours: '50 hrs',
          description: 'Build neural network architectures, backpropagation, CNNs for vision, and RNNs/Transformers for NLP.',
          topics: [
            { id: 'ai-t-3-1', title: 'PyTorch Tensors, Autograd & Custom Datasets', completed: false, concepts: ['DataLoader', 'GPU acceleration (CUDA)', 'Loss functions'] },
            { id: 'ai-t-3-2', title: 'Convolutional Neural Networks (CNNs)', completed: false, concepts: ['Kernel filters', 'Pooling', 'Transfer learning (ResNet)'] },
            { id: 'ai-t-3-3', title: 'Transformers & Self-Attention Mechanism', completed: false, concepts: ['Multi-head attention', 'Positional embeddings', 'BERT & GPT'] }
          ]
        },
        {
          id: 'ai-stg-4',
          stageNumber: 4,
          title: 'Generative AI, LLMs & MLOps Deployment',
          status: 'upcoming',
          estimatedHours: '45 hrs',
          description: 'LangChain, Retrieval-Augmented Generation (RAG), vector databases, FastAPI model endpoints, and Docker.',
          topics: [
            { id: 'ai-t-4-1', title: 'RAG Architecture with Vector DBs (Pinecone / Chroma)', completed: false, concepts: ['Embeddings', 'Semantic search', 'Chunking strategies'] },
            { id: 'ai-t-4-2', title: 'FastAPI Model Serving & Dockerization', completed: false, concepts: ['Async endpoints', 'Containerizing PyTorch models'] },
            { id: 'ai-t-4-3', title: 'MLflow & Experiment Tracking', completed: false, concepts: ['Model registry', 'Metrics logging', 'Automated CI/CD'] }
          ]
        }
      ]);
    } else if (lower.includes('devops') || lower.includes('cloud')) {
      this.stagesSubject.next([
        {
          id: 'do-stg-1',
          stageNumber: 1,
          title: 'Linux Systems Administration & Shell Scripting',
          status: 'completed',
          estimatedHours: '30 hrs',
          description: 'File permissions, process management, networking fundamentals, and automated Bash scripts.',
          topics: [
            { id: 'do-t-1-1', title: 'User, Group & File Permissions (chmod, chown)', completed: true, concepts: ['SUID/SGID', 'Access control lists', 'umask'] },
            { id: 'do-t-1-2', title: 'Process & Systemd Service Management', completed: true, concepts: ['systemctl', 'journalctl', 'Cron jobs'] },
            { id: 'do-t-1-3', title: 'Bash Automation & Network Troubleshooting', completed: true, concepts: ['curl, netstat, iptables', 'Error handling in Bash'] }
          ]
        },
        {
          id: 'do-stg-2',
          stageNumber: 2,
          title: 'Docker & Microservices Containerization',
          status: 'in-progress',
          estimatedHours: '35 hrs',
          description: 'Multi-stage Dockerfiles, image optimization, bridge networks, and multi-service Docker Compose.',
          topics: [
            { id: 'do-t-2-1', title: 'Docker Images, Layers & Docker Hub', completed: true, concepts: ['Alpine minimal bases', 'Caching layers', '.dockerignore'] },
            { id: 'do-t-2-2', title: 'Multi-Stage Production Builds', completed: true, concepts: ['Separating builder from runtime', 'Non-root user execution'] },
            { id: 'do-t-2-3', title: 'Docker Compose Networking & Named Volumes', completed: false, concepts: ['Service discovery', 'Data persistence', 'Health checks'] }
          ]
        },
        {
          id: 'do-stg-3',
          stageNumber: 3,
          title: 'Kubernetes (K8s) Cluster Orchestration',
          status: 'upcoming',
          estimatedHours: '50 hrs',
          description: 'Pods, Deployments, Services, Ingress Controllers, ConfigMaps, Secrets, and Helm package charts.',
          topics: [
            { id: 'do-t-3-1', title: 'Pod Lifecycle, ReplicaSets & Deployments', completed: false, concepts: ['Rolling updates', 'Rollbacks', 'Resource requests/limits'] },
            { id: 'do-t-3-2', title: 'Cluster Networking: ClusterIP, NodePort, Ingress', completed: false, concepts: ['Nginx Ingress', 'TLS Cert-Manager', 'DNS resolution'] },
            { id: 'do-t-3-3', title: 'Helm Charts for Declarative Deployments', completed: false, concepts: ['values.yaml', 'Templating', 'Release management'] }
          ]
        },
        {
          id: 'do-stg-4',
          stageNumber: 4,
          title: 'CI/CD Automation & Terraform Infrastructure as Code',
          status: 'upcoming',
          estimatedHours: '45 hrs',
          description: 'GitHub Actions workflow automation, Terraform AWS provisioning, remote state, and security scanning.',
          topics: [
            { id: 'do-t-4-1', title: 'GitHub Actions Matrix CI/CD Workflows', completed: false, concepts: ['Automated unit tests', 'Docker push', 'K8s deployment'] },
            { id: 'do-t-4-2', title: 'Terraform Modules, Variables & State Locking', completed: false, concepts: ['AWS VPC, EC2, RDS provisioning', 'S3 backend + DynamoDB locking'] },
            { id: 'do-t-4-3', title: 'Monitoring & Alerting with Prometheus & Grafana', completed: false, concepts: ['Metrics collection', 'AlertManager', 'SLA dashboards'] }
          ]
        }
      ]);
    } else {
      // Default: Java Full Stack Developer
      this.stagesSubject.next([
        {
          id: 'stg-1',
          stageNumber: 1,
          title: 'Java Fundamentals',
          status: 'completed',
          estimatedHours: '30 hrs',
          description: 'Master core syntax, primitive types, control flow, loops, and basic memory management in JVM.',
          topics: [
            { id: 't-1-1', title: 'Data Types, Operators & Variables', completed: true, concepts: ['Primitives vs References', 'Type Casting', 'Scope'] },
            { id: 't-1-2', title: 'Control Flow & Conditionals', completed: true, concepts: ['if-else', 'switch-case', 'ternary operator'] },
            { id: 't-1-3', title: 'Loops & Iteration', completed: true, concepts: ['for-loop', 'enhanced for', 'while & do-while'] },
            { id: 't-1-4', title: 'Methods, Parameters & Return Types', completed: true, concepts: ['Method Overloading', 'Pass by Value', 'Recursion'] }
          ]
        },
        {
          id: 'stg-2',
          stageNumber: 2,
          title: 'OOP & Collections Framework',
          status: 'completed',
          estimatedHours: '45 hrs',
          description: 'Grasp deep Object-Oriented principles, dynamic polymorphism, and standard Java Collection interfaces.',
          topics: [
            { id: 't-2-1', title: 'Encapsulation & Abstraction', completed: true, concepts: ['Access Modifiers', 'Abstract Classes', 'Interfaces'] },
            { id: 't-2-2', title: 'Inheritance & Polymorphism', completed: true, concepts: ['Method Overriding', 'super & this', 'Dynamic Dispatch'] },
            { id: 't-2-3', title: 'Collections: List, Set, Queue', completed: true, concepts: ['ArrayList vs LinkedList', 'HashSet', 'TreeSet'] },
            { id: 't-2-4', title: 'Maps & HashCode/Equals Contract', completed: true, concepts: ['HashMap internals', 'Collision handling', 'ConcurrentHashMap'] }
          ]
        },
        {
          id: 'stg-3',
          stageNumber: 3,
          title: 'Advanced Java & Modern Java 17+',
          status: 'in-progress',
          estimatedHours: '35 hrs',
          description: 'Modern Java functional features, lambdas, streams, records, sealed classes, and multi-threading.',
          topics: [
            { id: 't-3-1', title: 'Functional Interfaces & Lambdas', completed: true, concepts: ['Predicate', 'Function', 'Consumer', 'Supplier'] },
            { id: 't-3-2', title: 'Stream API & Collectors', completed: true, concepts: ['map, filter, reduce', 'parallel streams', 'groupingBy'] },
            { id: 't-3-3', title: 'Concurrency & Thread Pools', completed: false, concepts: ['ExecutorService', 'CompletableFuture', 'Virtual Threads'] },
            { id: 't-3-4', title: 'Exception Handling & Custom Exceptions', completed: true, concepts: ['Checked vs Unchecked', 'try-with-resources'] }
          ]
        },
        {
          id: 'stg-4',
          stageNumber: 4,
          title: 'Spring Boot Basics & Data JPA',
          status: 'upcoming',
          estimatedHours: '50 hrs',
          description: 'Learn Inversion of Control, Dependency Injection, Hibernate entity mapping, and automated database persistence.',
          topics: [
            { id: 't-4-1', title: 'Spring Core & IoC / DI', completed: false, concepts: ['@Component', '@Service', '@Autowired', 'Bean Lifecycle'] },
            { id: 't-4-2', title: 'Spring Boot Starters & Auto-configuration', completed: false, concepts: ['application.yml', 'Profiles', 'Actuator'] },
            { id: 't-4-3', title: 'Spring Data JPA & Hibernate', completed: false, concepts: ['Entities', '@OneToMany', 'Repositories', 'JPQL'] },
            { id: 't-4-4', title: 'Database Migrations with Flyway', completed: false, concepts: ['Schema Versioning', 'Rollbacks', 'Audit Trails'] }
          ]
        },
        {
          id: 'stg-5',
          stageNumber: 5,
          title: 'REST APIs & Web Services',
          status: 'upcoming',
          estimatedHours: '40 hrs',
          description: 'Construct resilient RESTful endpoints, request validation, global exception handlers, and API docs with OpenAPI.',
          topics: [
            { id: 't-5-1', title: 'RESTful Architecture & HTTP Methods', completed: false, concepts: ['GET, POST, PUT, DELETE', 'HTTP Status Codes', 'Idempotence'] },
            { id: 't-5-2', title: 'Request Validation & Error Handling', completed: false, concepts: ['@Valid', '@RestControllerAdvice', 'ProblemDetail'] },
            { id: 't-5-3', title: 'DTO Pattern & ModelMapper/MapStruct', completed: false, concepts: ['Decoupling Entities', 'Mapper Generation'] },
            { id: 't-5-4', title: 'Swagger / OpenAPI 3 Documentation', completed: false, concepts: ['Interactive API testing', 'API Schema generation'] }
          ]
        },
        {
          id: 'stg-6',
          stageNumber: 6,
          title: 'Spring Security & JWT Authentication',
          status: 'upcoming',
          estimatedHours: '35 hrs',
          description: 'Implement stateless security filters, token generation, role-based access control, and password encryption.',
          topics: [
            { id: 't-6-1', title: 'SecurityFilterChain & Filter Architecture', completed: false, concepts: ['UsernamePasswordFilter', 'SecurityContext'] },
            { id: 't-6-2', title: 'JWT Token Generation & Validation', completed: false, concepts: ['Claims', 'Signing Keys', 'Expiration & Refresh'] },
            { id: 't-6-3', title: 'Role-Based Access Control (RBAC)', completed: false, concepts: ['@PreAuthorize', 'GrantedAuthority', 'Permissions'] },
            { id: 't-6-4', title: 'CORS & CSRF Protection', completed: false, concepts: ['Allowed Origins', 'Header Security', 'Stateless APIs'] }
          ]
        },
        {
          id: 'stg-7',
          stageNumber: 7,
          title: 'Angular Frontend Integration',
          status: 'upcoming',
          estimatedHours: '45 hrs',
          description: 'Connect client-side Angular single page apps with backend REST endpoints, reactive forms, and route guards.',
          topics: [
            { id: 't-7-1', title: 'Standalone Components & Routing', completed: false, concepts: ['RouterOutlet', 'Lazy Loading', 'Child Routes'] },
            { id: 't-7-2', title: 'RxJS Observables & HttpClient', completed: false, concepts: ['pipe, map, catchError', 'HttpInterceptors for JWT'] },
            { id: 't-7-3', title: 'Reactive Forms & Custom Validators', completed: false, concepts: ['FormBuilder', 'Async Validation', 'FormGroup'] },
            { id: 't-7-4', title: 'AuthGuards & Route Protection', completed: false, concepts: ['canActivate', 'Token Redirection'] }
          ]
        },
        {
          id: 'stg-8',
          stageNumber: 8,
          title: 'Docker & Containerization',
          status: 'upcoming',
          estimatedHours: '25 hrs',
          description: 'Containerize both Spring Boot JARs and Angular Nginx builds with multi-stage Dockerfiles and Docker Compose.',
          topics: [
            { id: 't-8-1', title: 'Docker Images, Containers & Registries', completed: false, concepts: ['Docker CLI', 'Layers', 'Docker Hub'] },
            { id: 't-8-2', title: 'Multi-stage Dockerfile for Java & Angular', completed: false, concepts: ['Build stage vs Runtime', 'Minimal Alpine images'] },
            { id: 't-8-3', title: 'Docker Compose for Full Stack Local Dev', completed: false, concepts: ['Postgres service', 'Networks & Volumes', 'Env files'] },
            { id: 't-8-4', title: 'Container Networking & Health Checks', completed: false, concepts: ['DNS Resolution', 'Restart policies'] }
          ]
        },
        {
          id: 'stg-9',
          stageNumber: 9,
          title: 'AWS Deployment & CI/CD',
          status: 'upcoming',
          estimatedHours: '30 hrs',
          description: 'Automate build pipelines with GitHub Actions and deploy containers to AWS ECS/Elastic Beanstalk with RDS PostgreSQL.',
          topics: [
            { id: 't-9-1', title: 'GitHub Actions Continuous Integration', completed: false, concepts: ['Automated Testing', 'Docker Build & Push'] },
            { id: 't-9-2', title: 'AWS RDS Database Configuration', completed: false, concepts: ['Managed Postgres/MySQL', 'VPC Subnets', 'Security Groups'] },
            { id: 't-9-3', title: 'AWS Elastic Beanstalk / ECS Deployment', completed: false, concepts: ['Load Balancing', 'Auto Scaling', 'App Runner'] },
            { id: 't-9-4', title: 'Custom Domain & SSL with CloudFront/Route53', completed: false, concepts: ['HTTPS Termination', 'CDN Edge Caching'] }
          ]
        }
      ]);
    }
  }

  public toggleTopic(stageId: string, topicId: string): void {
    const stages = this.stagesSubject.value.map(stage => {
      if (stage.id === stageId) {
        const topics = stage.topics.map(t => {
          if (t.id === topicId) {
            return { ...t, completed: !t.completed };
          }
          return t;
        });

        // Update stage status based on topics
        const allDone = topics.every(t => t.completed);
        const anyDone = topics.some(t => t.completed);
        let status: 'completed' | 'in-progress' | 'upcoming' = 'upcoming';
        if (allDone) status = 'completed';
        else if (anyDone) status = 'in-progress';

        return { ...stage, topics, status };
      }
      return stage;
    });

    this.stagesSubject.next(stages);
  }
}
