package com.careerai.service;

import com.careerai.dto.jobanalyzer.JobAnalysisRequest;
import com.careerai.dto.jobanalyzer.JobAnalysisResponse;
import com.careerai.entity.CareerGoal;
import com.careerai.entity.JobAnalysis;
import com.careerai.entity.Skill;
import com.careerai.repository.CareerGoalRepository;
import com.careerai.repository.JobAnalysisRepository;
import com.careerai.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobAnalyzerService {

    private final JobAnalysisRepository jobAnalysisRepository;
    private final SkillRepository skillRepository;
    private final CareerGoalRepository careerGoalRepository;

    private static final List<String> COMMON_TECH_KEYWORDS = Arrays.asList(
            "Java", "Spring Boot", "REST API", "Microservices", "MySQL", "PostgreSQL", "Hibernate", "JPA",
            "Docker", "Kubernetes", "AWS", "Kafka", "RabbitMQ", "Redis", "TypeScript", "React", "Angular",
            "Python", "FastAPI", "Pandas", "NumPy", "PyTorch", "TensorFlow", "Git", "CI/CD", "Linux"
    );

    @Transactional
    public JobAnalysisResponse analyzeJob(Long userId, JobAnalysisRequest request) {
        String jd = request.getJobDescription();
        String lowerJd = jd.toLowerCase();

        List<Skill> userSkills = skillRepository.findByUserId(userId);
        Set<String> userSkillNames = userSkills.stream()
                .map(s -> s.getSkill().toLowerCase())
                .collect(Collectors.toSet());

        List<String> detectedInJd = COMMON_TECH_KEYWORDS.stream()
                .filter(k -> lowerJd.contains(k.toLowerCase()))
                .collect(Collectors.toList());

        if (detectedInJd.isEmpty()) {
            detectedInJd = Arrays.asList("Java", "Spring Boot", "MySQL", "REST API", "Docker");
        }

        List<String> matching = new ArrayList<>();
        List<String> missing = new ArrayList<>();

        for (String kw : detectedInJd) {
            if (userSkillNames.contains(kw.toLowerCase()) || isSubmatch(userSkillNames, kw)) {
                matching.add(kw);
            } else {
                missing.add(kw);
            }
        }

        int matchPercent;
        if (!detectedInJd.isEmpty()) {
            matchPercent = (int) Math.round(((double) matching.size() / detectedInJd.size()) * 100);
        } else {
            matchPercent = 75;
        }

        // Clamp between 30 and 95
        matchPercent = Math.max(35, Math.min(95, matchPercent));

        String status;
        if (matchPercent >= 80) {
            status = "HIGH_MATCH";
        } else if (matchPercent >= 60) {
            status = "MODERATE_MATCH";
        } else {
            status = "LOW_MATCH";
        }

        String recommendation;
        if (missing.isEmpty()) {
            recommendation = "Outstanding match! Your profile aligns closely with all core qualifications for this role. Tailor your resume summary and apply with confidence.";
        } else {
            recommendation = "Solid foundation! To maximize your interview conversion, prioritize closing your gap in "
                    + String.join(", ", missing) + " before applying or highlight equivalent project experience.";
        }

        JobAnalysis analysis = JobAnalysis.builder()
                .userId(userId)
                .jobDescription(jd)
                .jobMatch(matchPercent)
                .status(status)
                .matchingSkills(String.join(",", matching))
                .missingSkills(String.join(",", missing))
                .recommendation(recommendation)
                .build();

        JobAnalysis saved = jobAnalysisRepository.save(analysis);
        return mapToResponse(saved);
    }

    @Transactional
    public JobAnalysisResponse getLatestAnalysis(Long userId) {
        return jobAnalysisRepository.findTopByUserIdOrderByCreatedAtDesc(userId)
                .map(this::mapToResponse)
                .orElseGet(() -> {
                    JobAnalysis def = createDefaultAnalysis(userId);
                    return mapToResponse(jobAnalysisRepository.save(def));
                });
    }

    private boolean isSubmatch(Set<String> userSkillNames, String keyword) {
        String kwLower = keyword.toLowerCase();
        for (String userSkill : userSkillNames) {
            if (userSkill.contains(kwLower) || kwLower.contains(userSkill)) {
                return true;
            }
        }
        return false;
    }

    private JobAnalysis createDefaultAnalysis(Long userId) {
        CareerGoal goal = careerGoalRepository.findByUserIdAndSelectedTrue(userId).orElse(null);
        String title = goal != null && goal.getTitle() != null ? goal.getTitle() : "Full Stack Software Engineer";

        return JobAnalysis.builder()
                .userId(userId)
                .jobDescription("Seeking a Software Engineer with expertise in Java, Spring Boot, REST APIs, MySQL, and Docker to build enterprise cloud applications.")
                .jobMatch(82)
                .status("HIGH_MATCH")
                .matchingSkills("Java,Spring Boot,REST API,MySQL,Git")
                .missingSkills("Docker,Kubernetes,Kafka")
                .recommendation("Strong alignment with core backend stack! Closing your Docker and Kafka containerization gaps will place you in the top 10% of applicants for " + title + ".")
                .build();
    }

    @Transactional(readOnly = true)
    public List<JobAnalysisResponse> getJobHistory(Long userId) {
        return jobAnalysisRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private JobAnalysisResponse mapToResponse(JobAnalysis entity) {
        List<String> matching = entity.getMatchingSkills() != null && !entity.getMatchingSkills().isBlank()
                ? Arrays.stream(entity.getMatchingSkills().split(",")).map(String::trim).collect(Collectors.toList())
                : new ArrayList<>();

        List<String> missing = entity.getMissingSkills() != null && !entity.getMissingSkills().isBlank()
                ? Arrays.stream(entity.getMissingSkills().split(",")).map(String::trim).collect(Collectors.toList())
                : new ArrayList<>();

        return JobAnalysisResponse.builder()
                .id(entity.getId())
                .matchScore(entity.getJobMatch())
                .matchedSkills(matching)
                .missingSkills(missing)
                .status(entity.getStatus())
                .recommendation(entity.getRecommendation())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
