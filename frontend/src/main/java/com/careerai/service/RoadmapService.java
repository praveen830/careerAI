package com.careerai.service;

import com.careerai.dto.career.CareerGoalType;
import com.careerai.dto.roadmap.RoadmapProgressUpdateRequest;
import com.careerai.dto.roadmap.RoadmapResponse;
import com.careerai.entity.CareerGoal;
import com.careerai.entity.Roadmap;
import com.careerai.exception.ResourceNotFoundException;
import com.careerai.repository.CareerGoalRepository;
import com.careerai.repository.ProgressRepository;
import com.careerai.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;
    private final CareerGoalRepository careerGoalRepository;
    private final ProgressRepository progressRepository;

    @Transactional
    public List<RoadmapResponse> getRoadmap(Long userId) {
        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByOrderIndexAsc(userId);
        if (roadmaps.isEmpty()) {
            return generateRoadmapForUser(userId);
        }
        return roadmaps.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RoadmapResponse getRoadmapById(Long userId, Long id) {
        Roadmap roadmap = roadmapRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap milestone not found with id: " + id));
        return mapToResponse(roadmap);
    }

    @Transactional
    public RoadmapResponse updateProgress(Long userId, Long id, RoadmapProgressUpdateRequest request) {
        Roadmap roadmap = roadmapRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap milestone not found with id: " + id));

        roadmap.setProgress(request.getProgress());
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            roadmap.setStatus(request.getStatus());
        } else {
            if (request.getProgress() >= 100) {
                roadmap.setStatus("COMPLETED");
            } else if (request.getProgress() > 0) {
                roadmap.setStatus("IN_PROGRESS");
            } else {
                roadmap.setStatus("NOT_STARTED");
            }
        }

        Roadmap saved = roadmapRepository.save(roadmap);
        updateUserProgressRecord(userId);
        return mapToResponse(saved);
    }

    @Transactional
    public RoadmapResponse markComplete(Long userId, Long id) {
        Roadmap roadmap = roadmapRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap milestone not found with id: " + id));

        roadmap.setProgress(100);
        roadmap.setStatus("COMPLETED");

        Roadmap saved = roadmapRepository.save(roadmap);
        updateUserProgressRecord(userId);
        return mapToResponse(saved);
    }

    @Transactional
    public List<RoadmapResponse> generateRoadmapForUser(Long userId) {
        roadmapRepository.deleteByUserId(userId);

        CareerGoal goal = careerGoalRepository.findByUserIdAndSelectedTrue(userId).orElse(null);
        CareerGoalType goalType = goal != null ? CareerGoalType.fromString(goal.getCareerName()) : CareerGoalType.JAVA_FULL_STACK_DEVELOPER;

        List<Roadmap> milestones = createMilestones(userId, goalType);
        List<Roadmap> saved = roadmapRepository.saveAll(milestones);
        return saved.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    private void updateUserProgressRecord(Long userId) {
        progressRepository.findByUserId(userId).ifPresent(p -> {
            List<Roadmap> all = roadmapRepository.findByUserIdOrderByOrderIndexAsc(userId);
            long completed = all.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus())).count();
            int overall = all.isEmpty() ? 0 : (int) Math.round(((double) completed / all.size()) * 100);
            p.setRoadmapCompleted((int) completed);
            p.setOverallProgress(Math.max(p.getOverallProgress(), overall));
            progressRepository.save(p);
        });
    }

    private List<Roadmap> createMilestones(Long userId, CareerGoalType goalType) {
        List<Roadmap> list = new ArrayList<>();

        switch (goalType) {
            case FRONTEND_DEVELOPER -> {
                list.add(Roadmap.builder().userId(userId).orderIndex(1).title("HTML5 & Modern CSS3").description("Semantic HTML, Flexbox, Grid, CSS Variables, Responsive Design").estimatedDays(10).progress(100).status("COMPLETED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(2).title("JavaScript ES6+").description("Closures, Promises, Async/Await, Prototypes, Array Methods").estimatedDays(14).progress(80).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(3).title("TypeScript Fundamentals").description("Static typing, Interfaces, Generics, TSConfig, Utility Types").estimatedDays(10).progress(40).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(4).title("Angular Core Architecture").description("Components, Modules/Standalone, Dependency Injection, Services, Routing").estimatedDays(18).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(5).title("RxJS & State Management").description("Observables, Subjects, Operators, Signal-based reactivity").estimatedDays(14).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(6).title("REST API Integration").description("HttpClient, Interceptors, Error handling, Auth tokens").estimatedDays(10).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(7).title("Testing & Web Performance").description("Jasmine/Karma, Lighthouse auditing, Lazy loading").estimatedDays(10).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(8).title("Build Production Frontend App").description("Full featured responsive portfolio-ready web application").estimatedDays(20).progress(0).status("NOT_STARTED").build());
            }
            case DATA_ANALYST -> {
                list.add(Roadmap.builder().userId(userId).orderIndex(1).title("Advanced Excel & Statistics").description("Pivot tables, Lookup formulas, Statistical distributions").estimatedDays(10).progress(100).status("COMPLETED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(2).title("SQL Querying & Data Extraction").description("Joins, Window functions, CTEs, Aggregations, Optimization").estimatedDays(14).progress(70).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(3).title("Python for Data Analysis").description("NumPy, Pandas, Data wrangling, Cleaning, Handling missing data").estimatedDays(18).progress(30).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(4).title("Data Visualization & Storytelling").description("Matplotlib, Seaborn, Interactive dashboards, Infographics").estimatedDays(12).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(5).title("Power BI / Tableau").description("Data modeling, DAX expressions, Visual reports, Drill-downs").estimatedDays(16).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(6).title("Business Analytics Capstone").description("End-to-end analytical case study presentation").estimatedDays(20).progress(0).status("NOT_STARTED").build());
            }
            case AI_ML_ENGINEER -> {
                list.add(Roadmap.builder().userId(userId).orderIndex(1).title("Python & Linear Algebra").description("Python 3.12, Matrix calculus, Probability theory, Vectorization").estimatedDays(14).progress(100).status("COMPLETED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(2).title("Classical Machine Learning").description("Scikit-Learn, Regression, Random Forests, XGBoost, Cross-validation").estimatedDays(18).progress(60).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(3).title("Deep Learning & PyTorch").description("Tensors, Autograd, CNNs, RNNs, Backpropagation, Transfer learning").estimatedDays(21).progress(20).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(4).title("Vector Databases & Embeddings").description("ChromaDB, Pinecone, Cosine similarity, Semantic search").estimatedDays(14).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(5).title("Large Language Models & RAG").description("LangChain, Prompt engineering, RAG pipelines, Fine-tuning basics").estimatedDays(20).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(6).title("MLOps & Container Deployment").description("FastAPI model serving, Docker containers, MLflow tracking").estimatedDays(18).progress(0).status("NOT_STARTED").build());
            }
            case DEVOPS_ENGINEER -> {
                list.add(Roadmap.builder().userId(userId).orderIndex(1).title("Linux Administration & Bash").description("File permissions, Shell scripting, Networking basics, Systemd").estimatedDays(12).progress(100).status("COMPLETED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(2).title("Git & Version Control Workflows").description("Branching strategies, Rebase, Merge conflict resolution, Hooks").estimatedDays(8).progress(80).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(3).title("Docker Containerization").description("Dockerfile best practices, Multi-stage builds, Docker Compose, Volumes").estimatedDays(15).progress(40).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(4).title("CI/CD Automation").description("GitHub Actions, Jenkins, Automated testing, Artifact publishing").estimatedDays(16).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(5).title("Kubernetes Orchestration").description("Pods, Deployments, Services, ConfigMaps, Ingress controllers").estimatedDays(21).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(6).title("Cloud Infrastructure on AWS").description("EC2, S3, VPC, IAM, RDS, CloudWatch monitoring, Terraform").estimatedDays(25).progress(0).status("NOT_STARTED").build());
            }
            default -> {
                // Exact 10 Java Full Stack milestones as mandated by the naming contract
                list.add(Roadmap.builder().userId(userId).orderIndex(1).title("Java Fundamentals").description("Syntax, Data Types, Control Statements, Methods, Memory Model").estimatedDays(10).progress(100).status("COMPLETED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(2).title("OOP").description("Encapsulation, Inheritance, Polymorphism, Abstraction, Interfaces, SOLID").estimatedDays(12).progress(100).status("COMPLETED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(3).title("Collections").description("List, Set, Map, Generics, Comparable/Comparator, Stream API, Lambdas").estimatedDays(14).progress(80).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(4).title("JDBC").description("Connection pooling, PreparedStatements, Transaction management, ResultSets").estimatedDays(8).progress(60).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(5).title("Spring Boot").description("IoC Container, Dependency Injection, Spring Data JPA, Auto-configuration").estimatedDays(18).progress(40).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(6).title("Spring Security").description("AuthenticationManager, JWT Filters, BCrypt, Role-based Authorization").estimatedDays(14).progress(20).status("IN_PROGRESS").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(7).title("REST APIs").description("HTTP Methods, Status Codes, Request/Response DTOs, Bean Validation").estimatedDays(10).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(8).title("Angular").description("TypeScript, Components, Services, RxJS, Template/Reactive Forms, Routing").estimatedDays(18).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(9).title("Docker").description("Containerization, Dockerfile, Docker Compose, MySQL and App isolation").estimatedDays(12).progress(0).status("NOT_STARTED").build());
                list.add(Roadmap.builder().userId(userId).orderIndex(10).title("Build Full Stack Project").description("End-to-end full stack application with authentication, database, and UI").estimatedDays(21).progress(0).status("NOT_STARTED").build());
            }
        }

        return list;
    }

    private RoadmapResponse mapToResponse(Roadmap roadmap) {
        return RoadmapResponse.builder()
                .id(roadmap.getId())
                .title(roadmap.getTitle())
                .description(roadmap.getDescription())
                .status(roadmap.getStatus())
                .progress(roadmap.getProgress())
                .estimatedDays(roadmap.getEstimatedDays())
                .orderIndex(roadmap.getOrderIndex())
                .build();
    }
}
