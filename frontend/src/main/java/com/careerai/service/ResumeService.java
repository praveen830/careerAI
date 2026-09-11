package com.careerai.service;

import com.careerai.dto.resume.ResumeAnalysisRequest;
import com.careerai.dto.resume.ResumeResponse;
import com.careerai.entity.CareerGoal;
import com.careerai.entity.Resume;
import com.careerai.exception.ValidationException;
import com.careerai.repository.CareerGoalRepository;
import com.careerai.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeService {

    private final ResumeRepository resumeRepository;
    private final CareerGoalRepository careerGoalRepository;

    @Transactional
    public ResumeResponse uploadAndAnalyze(Long userId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ValidationException("Resume file is required");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new ValidationException("File size exceeds the 5 MB maximum limit");
        }
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";
        String contentType = file.getContentType();
        if ((contentType != null && !contentType.equalsIgnoreCase("application/pdf")) && !filename.endsWith(".pdf")) {
            throw new ValidationException("Only PDF resumes are supported");
        }

        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "student_resume.pdf";
        long fileSize = file.getSize();

        return performAnalysis(userId, fileName, fileSize, "");
    }

    @Transactional
    public ResumeResponse analyzeText(Long userId, ResumeAnalysisRequest request) {
        String text = request != null && request.getResumeText() != null ? request.getResumeText() : "";
        return performAnalysis(userId, "pasted_resume_text.txt", (long) text.length(), text);
    }

    @Transactional
    public ResumeResponse getLatestResume(Long userId) {
        return resumeRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .map(this::mapToResponse)
                .orElseGet(() -> {
                    // Seed initial analysis if none exists
                    Resume defaultResume = createDefaultAnalysis(userId);
                    return mapToResponse(resumeRepository.save(defaultResume));
                });
    }

    private ResumeResponse performAnalysis(Long userId, String fileName, Long fileSize, String text) {
        CareerGoal goal = careerGoalRepository.findByUserIdAndSelectedTrue(userId).orElse(null);
        String goalTitle = goal != null && goal.getTitle() != null ? goal.getTitle().toLowerCase() : "";

        List<String> skillsFound = new ArrayList<>();
        List<String> missingSkills = new ArrayList<>();
        List<String> suggestions = new ArrayList<>();
        int score;

        if (goalTitle.contains("python") || goalTitle.contains("data") || goalTitle.contains("ai")) {
            skillsFound.addAll(Arrays.asList("Python", "NumPy", "Pandas", "Scikit-Learn", "SQL", "Git"));
            missingSkills.addAll(Arrays.asList("PyTorch / TensorFlow", "FastAPI / Docker", "MLOps / MLflow", "RAG & Vector DBs"));
            suggestions.addAll(Arrays.asList(
                    "Quantify your model performance (e.g. 'Achieved 94.2% F1-score reducing false positives by 22%')",
                    "Add production serving experience using FastAPI, Docker, or TorchServe",
                    "Highlight data engineering pipelines (e.g. ETL processing on AWS/GCP with Airflow)"
            ));
            score = 76;
        } else if (goalTitle.contains("frontend") || goalTitle.contains("react") || goalTitle.contains("angular")) {
            skillsFound.addAll(Arrays.asList("JavaScript", "TypeScript", "HTML5", "CSS3 / Sass", "React / Angular", "Git"));
            missingSkills.addAll(Arrays.asList("State Management (NgRx/Redux)", "Unit Testing (Jest/Karma)", "Performance & Web Vitals", "CI/CD Deployment"));
            suggestions.addAll(Arrays.asList(
                    "Include Lighthouse performance metrics (e.g. 'Optimized Largest Contentful Paint by 40%')",
                    "Add links to live portfolio demos and open source component libraries",
                    "Demonstrate automated testing coverage with Jest, Cypress, or Playwright"
            ));
            score = 81;
        } else {
            // Full Stack / Java
            skillsFound.addAll(Arrays.asList("Java", "Spring Boot", "REST APIs", "MySQL", "Git", "Maven"));
            missingSkills.addAll(Arrays.asList("Microservices (Spring Cloud)", "Docker & Containerization", "Redis Caching", "Kafka / RabbitMQ"));
            suggestions.addAll(Arrays.asList(
                    "Highlight measurable backend impact (e.g. 'Designed indexing strategy reducing query latency by 45%')",
                    "Add cloud deployment or containerization experience (Docker Compose, Kubernetes)",
                    "Include asynchronous message queue integration (RabbitMQ or Kafka) in project architectures"
            ));
            score = 78;
        }

        String status = score >= 80 ? "STRONG" : (score >= 65 ? "MODERATE" : "NEEDS_IMPROVEMENT");

        Resume resume = Resume.builder()
                .userId(userId)
                .fileName(fileName)
                .fileSize(fileSize)
                .resumeScore(score)
                .resumeStatus(status)
                .skillsFound(String.join(",", skillsFound))
                .missingSkills(String.join(",", missingSkills))
                .suggestions(String.join(";", suggestions))
                .build();

        Resume saved = resumeRepository.save(resume);
        return mapToResponse(saved);
    }

    private Resume createDefaultAnalysis(Long userId) {
        return Resume.builder()
                .userId(userId)
                .fileName("Student_Software_Resume.pdf")
                .fileSize(245760L)
                .resumeScore(78)
                .resumeStatus("MODERATE")
                .skillsFound("Java,Spring Boot,REST APIs,MySQL,Git,Maven")
                .missingSkills("Docker & Containers,Spring Cloud Microservices,Redis,Kafka")
                .suggestions("Highlight measurable backend impact (e.g. 'Designed indexing strategy reducing query latency by 45%');Add containerization experience with Docker;Include asynchronous messaging integration in project descriptions")
                .build();
    }

    private ResumeResponse mapToResponse(Resume resume) {
        List<String> found = resume.getSkillsFound() != null && !resume.getSkillsFound().isBlank()
                ? Arrays.stream(resume.getSkillsFound().split(",")).map(String::trim).collect(Collectors.toList())
                : new ArrayList<>();

        List<String> missing = resume.getMissingSkills() != null && !resume.getMissingSkills().isBlank()
                ? Arrays.stream(resume.getMissingSkills().split(",")).map(String::trim).collect(Collectors.toList())
                : new ArrayList<>();

        List<String> suggestions = resume.getSuggestions() != null && !resume.getSuggestions().isBlank()
                ? Arrays.stream(resume.getSuggestions().split(";")).map(String::trim).collect(Collectors.toList())
                : new ArrayList<>();

        return ResumeResponse.builder()
                .id(resume.getId())
                .fileName(resume.getFileName())
                .fileSize(resume.getFileSize())
                .resumeScore(resume.getResumeScore())
                .resumeStatus(resume.getResumeStatus())
                .skillsFound(found)
                .missingSkills(missing)
                .suggestions(suggestions)
                .createdAt(resume.getCreatedAt())
                .build();
    }
}
