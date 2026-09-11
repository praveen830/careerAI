package com.careerai.service;

import com.careerai.dto.project.ProjectResponse;
import com.careerai.entity.CareerGoal;
import com.careerai.entity.Project;
import com.careerai.entity.Roadmap;
import com.careerai.exception.ResourceNotFoundException;
import com.careerai.repository.CareerGoalRepository;
import com.careerai.repository.ProjectRepository;
import com.careerai.repository.RoadmapRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final RoadmapRepository roadmapRepository;
    private final CareerGoalRepository careerGoalRepository;

    @Transactional
    public List<ProjectResponse> getProjects(Long userId) {
        List<Project> list = projectRepository.findAllForUser(userId);
        if (list.isEmpty()) {
            list = seedDefaultProjects(userId);
        }
        return list.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> getRecommendedProjects(Long userId) {
        List<ProjectResponse> all = getProjects(userId);
        return all.stream()
                .filter(p -> "INTERMEDIATE".equalsIgnoreCase(p.getDifficulty()) || "ADVANCED".equalsIgnoreCase(p.getDifficulty()))
                .limit(4)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProjectResponse getProjectById(Long userId, Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
        return mapToResponse(project);
    }

    @Transactional
    public ProjectResponse toggleBookmark(Long userId, Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setBookmarked(!Boolean.TRUE.equals(project.getBookmarked()));
        Project saved = projectRepository.save(project);
        return mapToResponse(saved);
    }

    @Transactional
    public ProjectResponse addToRoadmap(Long userId, Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));

        project.setAddedToRoadmap(true);
        project.setStatus("IN_PROGRESS");
        Project saved = projectRepository.save(project);

        // Add milestone to Roadmap if not already present
        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByOrderIndexAsc(userId);
        int nextOrder = roadmaps.size() + 1;
        Roadmap milestone = Roadmap.builder()
                .userId(userId)
                .title("Capstone Project: " + project.getTitle())
                .description(project.getDescription())
                .estimatedDays(28)
                .progress(10)
                .status("IN_PROGRESS")
                .orderIndex(nextOrder)
                .build();
        roadmapRepository.save(milestone);

        return mapToResponse(saved);
    }

    @Transactional
    public List<Project> seedDefaultProjects(Long userId) {
        CareerGoal goal = careerGoalRepository.findByUserIdAndSelectedTrue(userId).orElse(null);
        String goalTitle = goal != null && goal.getTitle() != null ? goal.getTitle().toLowerCase() : "";

        List<Project> projects = new ArrayList<>();

        if (goalTitle.contains("python") || goalTitle.contains("data") || goalTitle.contains("ai")) {
            projects.add(Project.builder()
                    .userId(userId)
                    .title("Multi-Modal RAG Knowledge Engine")
                    .description("Build a production Retrieval-Augmented Generation system using LangChain, ChromaDB, and FastAPI with citation grounding.")
                    .technologies("Python, FastAPI, LangChain, ChromaDB, Docker")
                    .difficulty("ADVANCED")
                    .duration("3-4 weeks")
                    .reason("Directly bridges LLM, Vector Embeddings, and API Deployment skill gaps.")
                    .bookmarked(false)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());

            projects.add(Project.builder()
                    .userId(userId)
                    .title("Real-Time Financial Fraud Detection Pipeline")
                    .description("End-to-end streaming ML pipeline processing transactions with Scikit-learn, Kafka, and PostgreSQL.")
                    .technologies("Python, Scikit-Learn, Apache Kafka, PostgreSQL, Docker")
                    .difficulty("INTERMEDIATE")
                    .duration("2-3 weeks")
                    .reason("Demonstrates machine learning inference in high-throughput enterprise pipelines.")
                    .bookmarked(false)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());

            projects.add(Project.builder()
                    .userId(userId)
                    .title("Computer Vision Defect Detection System")
                    .description("PyTorch convolutional neural network for automated defect classification with interactive web dashboard.")
                    .technologies("Python, PyTorch, OpenCV, Streamlit")
                    .difficulty("INTERMEDIATE")
                    .duration("2 weeks")
                    .reason("Proves deep learning architecture design and image tensor operations.")
                    .bookmarked(false)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());
        } else if (goalTitle.contains("frontend") || goalTitle.contains("react") || goalTitle.contains("angular")) {
            projects.add(Project.builder()
                    .userId(userId)
                    .title("Enterprise Design System & Component Library")
                    .description("Build and publish an accessible WCAG 2.1 AA compliant UI kit with Storybook, TypeScript, and micro-animations.")
                    .technologies("TypeScript, React/Angular, Storybook, CSS Modules, Jest")
                    .difficulty("INTERMEDIATE")
                    .duration("2-3 weeks")
                    .reason("Demonstrates mastery of UI architecture, design tokens, and modular code.")
                    .bookmarked(false)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());

            projects.add(Project.builder()
                    .userId(userId)
                    .title("Real-Time Kanban Collaboration Platform")
                    .description("Interactive drag-and-drop workspace with optimistic UI updates, WebSockets, and offline synchronization.")
                    .technologies("TypeScript, WebSockets, RxJS/Redux, TailwindCSS")
                    .difficulty("ADVANCED")
                    .duration("3-4 weeks")
                    .reason("Validates real-time state synchronization, drag-drop physics, and offline caching.")
                    .bookmarked(false)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());
        } else {
            // Default Java Full Stack
            projects.add(Project.builder()
                    .userId(userId)
                    .title("Cloud-Native Distributed E-Commerce Microservices")
                    .description("Resilient microservices architecture with Spring Cloud, Eureka discovery, Spring Data JPA, JWT auth, and RabbitMQ.")
                    .technologies("Java 17, Spring Boot 3, MySQL, Redis, RabbitMQ, Docker")
                    .difficulty("ADVANCED")
                    .duration("4 weeks")
                    .reason("Directly bridges your Microservices, Cloud Deployment, and Message Broker gaps.")
                    .bookmarked(false)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());

            projects.add(Project.builder()
                    .userId(userId)
                    .title("FinTech Payment Gateway & Ledger Service")
                    .description("High-concurrency idempotent transaction engine featuring double-entry ledger with Spring Boot, Hibernate, and MySQL ACID guarantees.")
                    .technologies("Java 17, Spring Boot 3, Spring Data JPA, MySQL, JUnit 5")
                    .difficulty("INTERMEDIATE")
                    .duration("2-3 weeks")
                    .reason("Showcases backend data integrity, transactional locking, and defensive coding.")
                    .bookmarked(false)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());

            projects.add(Project.builder()
                    .userId(userId)
                    .title("Full Stack AI Career & Skill Gap Analyzer")
                    .description("Interactive analytics dashboard with role-based JWT authentication, ATS parser, and dynamic gap matrix.")
                    .technologies("Java 17, Spring Boot 3, Angular / React, MySQL, JJWT")
                    .difficulty("INTERMEDIATE")
                    .duration("2 weeks")
                    .reason("Covers the full stack spectrum: REST API contract design to polished modern frontend UI.")
                    .bookmarked(true)
                    .addedToRoadmap(false)
                    .status("RECOMMENDED")
                    .build());
        }

        return projectRepository.saveAll(projects);
    }

    private ProjectResponse mapToResponse(Project project) {
        List<String> techList = new ArrayList<>();
        if (project.getTechnologies() != null && !project.getTechnologies().isBlank()) {
            techList = Arrays.stream(project.getTechnologies().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toList());
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .technologies(techList)
                .difficulty(project.getDifficulty())
                .duration(project.getDuration())
                .reason(project.getReason())
                .bookmarked(project.getBookmarked())
                .addedToRoadmap(project.getAddedToRoadmap())
                .status(project.getStatus())
                .build();
    }
}
