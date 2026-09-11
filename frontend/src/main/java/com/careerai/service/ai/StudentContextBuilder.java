package com.careerai.service.ai;

import com.careerai.dto.aiassistant.StudentCareerContext;
import com.careerai.dto.career.CareerGoalType;
import com.careerai.dto.progress.ProgressResponse;
import com.careerai.dto.project.ProjectResponse;
import com.careerai.dto.roadmap.RoadmapResponse;
import com.careerai.dto.skillgap.SkillGapItem;
import com.careerai.dto.skillgap.SkillGapResponse;
import com.careerai.entity.CareerGoal;
import com.careerai.entity.Skill;
import com.careerai.entity.StudentProfile;
import com.careerai.entity.User;
import com.careerai.repository.CareerGoalRepository;
import com.careerai.repository.SkillRepository;
import com.careerai.repository.StudentProfileRepository;
import com.careerai.service.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudentContextBuilder {

    private final AuthService authService;
    private final StudentProfileRepository studentProfileRepository;
    private final CareerGoalRepository careerGoalRepository;
    private final SkillRepository skillRepository;
    private final SkillGapService skillGapService;
    private final RoadmapService roadmapService;
    private final ProjectService projectService;
    private final ProgressService progressService;

    public StudentCareerContext buildCurrentStudentContext() {
        User user = authService.getAuthenticatedUser();
        return buildStudentContext(user.getId(), user);
    }

    public StudentCareerContext buildStudentContext(Long userId, User user) {
        log.debug("Building AI mentor context for student ID: {}", userId);

        // 1. Profile Information
        StudentProfile profile = studentProfileRepository.findByUserId(userId).orElse(null);

        // 2. Career Goal
        CareerGoal goal = careerGoalRepository.findByUserIdAndSelectedTrue(userId).orElse(null);
        String careerGoalTitle = (goal != null && goal.getCareerName() != null)
                ? goal.getCareerName()
                : CareerGoalType.JAVA_FULL_STACK_DEVELOPER.getDisplayName();
        String careerGoalDescription = (goal != null && goal.getDescription() != null)
                ? goal.getDescription()
                : CareerGoalType.JAVA_FULL_STACK_DEVELOPER.getDefaultDescription();

        // 3. Current Skills
        List<Skill> userSkills = skillRepository.findByUserId(userId);
        List<StudentCareerContext.SkillSummary> skillSummaries = userSkills.stream()
                .map(s -> StudentCareerContext.SkillSummary.builder()
                        .skillName(s.getSkill())
                        .proficiency(s.getProficiency())
                        .experience(s.getExperience())
                        .lastUsed(s.getLastUsed())
                        .build())
                .collect(Collectors.toList());

        // 4. Authoritative Skill Gaps & Readiness Score
        SkillGapResponse gapResponse = skillGapService.getSkillGapAnalysis();
        int readinessScore = (gapResponse != null && gapResponse.getReadinessScore() != null)
                ? gapResponse.getReadinessScore()
                : 0;

        List<SkillGapItem> gapItems = (gapResponse != null && gapResponse.getSkillGaps() != null)
                ? gapResponse.getSkillGaps()
                : new ArrayList<>();

        List<StudentCareerContext.GapSummary> gapSummaries = gapItems.stream()
                .map(g -> StudentCareerContext.GapSummary.builder()
                        .skillName(g.getSkillName())
                        .currentLevel(g.getCurrentLevel())
                        .requiredLevel(g.getRequiredLevel())
                        .gapLevel(g.getGapLevel())
                        .severity(g.getSeverity())
                        .build())
                .collect(Collectors.toList());

        // Authoritatively determine the recommended next skill from gap analysis
        String recommendedNextSkill = determineRecommendedNextSkill(gapItems);

        // 5. Roadmap Details
        List<RoadmapResponse> roadmaps = roadmapService.getRoadmap(userId);
        List<StudentCareerContext.MilestoneSummary> milestoneSummaries = roadmaps.stream()
                .map(r -> StudentCareerContext.MilestoneSummary.builder()
                        .title(r.getTitle())
                        .orderIndex(r.getOrderIndex())
                        .progress(r.getProgress())
                        .status(r.getStatus())
                        .duration(r.getEstimatedDays() != null ? r.getEstimatedDays() + " days" : "")
                        .build())
                .collect(Collectors.toList());

        String nextMilestone = roadmaps.stream()
                .filter(r -> r.getProgress() == null || r.getProgress() < 100)
                .map(RoadmapResponse::getTitle)
                .findFirst()
                .orElse("Advanced Architecture & Capstones");

        // 6. Projects Details
        List<ProjectResponse> projects = projectService.getProjects(userId);
        List<StudentCareerContext.ProjectSummary> projectSummaries = projects.stream()
                .map(p -> StudentCareerContext.ProjectSummary.builder()
                        .title(p.getTitle())
                        .techStack(p.getTechnologies() != null ? String.join(", ", p.getTechnologies()) : "")
                        .difficulty(p.getDifficulty())
                        .status(p.getStatus())
                        .category(p.getDuration() != null ? p.getDuration() : "General")
                        .build())
                .collect(Collectors.toList());

        int completedProjects = (int) projects.stream()
                .filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus()))
                .count();

        // 7. Overall Progress & Streak
        ProgressResponse progress = progressService.getProgress(userId);
        int overallRoadmapProgress = (progress != null && progress.getOverallProgress() != null)
                ? progress.getOverallProgress()
                : (milestonesProgressAverage(milestoneSummaries));

        int learningStreak = (progress != null && progress.getLearningStreak() != null)
                ? progress.getLearningStreak()
                : 7;

        int skillsImproved = (progress != null && progress.getSkillsImproved() != null)
                ? progress.getSkillsImproved()
                : userSkills.size();

        return StudentCareerContext.builder()
                .userId(userId)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .college(profile != null ? profile.getCollege() : null)
                .degree(profile != null ? profile.getDegree() : null)
                .branch(profile != null ? profile.getBranch() : null)
                .currentYear(profile != null ? profile.getCurrentYear() : null)
                .graduationYear(profile != null ? profile.getGraduationYear() : null)
                .cgpa(profile != null ? profile.getCgpa() : null)
                .profileCompletion(profile != null ? profile.getProfileCompletion() : null)
                .careerGoal(careerGoalTitle)
                .careerDescription(careerGoalDescription)
                .skills(skillSummaries)
                .readinessScore(readinessScore)
                .skillGaps(gapSummaries)
                .recommendedNextSkill(recommendedNextSkill)
                .overallRoadmapProgress(overallRoadmapProgress)
                .nextMilestone(nextMilestone)
                .milestones(milestoneSummaries)
                .projects(projectSummaries)
                .completedProjectsCount(completedProjects)
                .skillsImproved(skillsImproved)
                .learningStreak(learningStreak)
                .build();
    }

    /**
     * Authoritative logic to derive recommended next skill:
     * - Filters for unresolved gaps (gapLevel > 0)
     * - Sorts by severity rank (CRITICAL -> MODERATE -> GOOD)
     * - Then by largest gap level descending
     */
    public String determineRecommendedNextSkill(List<SkillGapItem> gaps) {
        if (gaps == null || gaps.isEmpty()) {
            return "Foundational Architecture";
        }

        return gaps.stream()
                .filter(g -> g.getGapLevel() != null && g.getGapLevel() > 0)
                .min(Comparator
                        .comparingInt(this::getSeverityRank)
                        .thenComparing(Comparator.comparingInt((SkillGapItem g) -> g.getGapLevel() != null ? g.getGapLevel() : 0).reversed())
                )
                .map(SkillGapItem::getSkillName)
                .orElse(gaps.get(0).getSkillName());
    }

    private int getSeverityRank(SkillGapItem gap) {
        String status = gap.getSeverity() != null ? gap.getSeverity().toUpperCase() : "";
        if (status.contains("CRITICAL")) {
            return 1;
        } else if (status.contains("HIGH") || status.contains("MODERATE") || status.contains("NEEDS_IMPROVEMENT")) {
            return 2;
        } else {
            return 3;
        }
    }

    private int milestonesProgressAverage(List<StudentCareerContext.MilestoneSummary> milestones) {
        if (milestones.isEmpty()) return 0;
        int sum = milestones.stream().mapToInt(m -> m.getProgress() != null ? m.getProgress() : 0).sum();
        return Math.round((float) sum / milestones.size());
    }
}
