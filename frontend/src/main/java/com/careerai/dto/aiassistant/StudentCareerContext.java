package com.careerai.dto.aiassistant;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentCareerContext {

    private Long userId;
    private String fullName;
    private String email;
    private String college;
    private String degree;
    private String branch;
    private String currentYear;
    private Integer graduationYear;
    private Double cgpa;
    private Integer profileCompletion;

    // Career Goal
    private String careerGoal;
    private String careerDescription;

    // Skills
    @Builder.Default
    private List<SkillSummary> skills = new ArrayList<>();

    // Skill Gaps & Readiness
    private Integer readinessScore;
    @Builder.Default
    private List<GapSummary> skillGaps = new ArrayList<>();
    private String recommendedNextSkill;

    // Roadmap
    private Integer overallRoadmapProgress;
    private String nextMilestone;
    @Builder.Default
    private List<MilestoneSummary> milestones = new ArrayList<>();

    // Projects
    private Integer completedProjectsCount;
    @Builder.Default
    private List<ProjectSummary> projects = new ArrayList<>();

    // Progress Metrics
    private Integer skillsImproved;
    private Integer learningStreak;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillSummary {
        private String skillName;
        private String proficiency;
        private Integer experience;
        private String lastUsed;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GapSummary {
        private String skillName;
        private Integer currentLevel;
        private Integer requiredLevel;
        private Integer gapLevel;
        private String severity;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneSummary {
        private String title;
        private Integer orderIndex;
        private Integer progress;
        private String status;
        private String duration;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ProjectSummary {
        private String title;
        private String techStack;
        private String difficulty;
        private String status;
        private String category;
    }

    /**
     * Serializes this context into a safe, clean structured text block for the AI prompt.
     */
    public String toPromptContext() {
        StringBuilder sb = new StringBuilder();
        sb.append("=== Authenticated Student CareerAI Profile ===\n");
        sb.append("Student Name: ").append(fullName != null ? fullName : "Student").append("\n");
        if (college != null || degree != null) {
            sb.append("Education: ").append(degree != null ? degree : "Engineering")
              .append(" at ").append(college != null ? college : "University")
              .append(" (").append(currentYear != null ? currentYear : "Undergraduate")
              .append(", CGPA: ").append(cgpa != null ? cgpa : "N/A").append(")\n");
        }
        sb.append("\nCareer Goal: ").append(careerGoal != null ? careerGoal : "Software Engineer").append("\n");
        if (careerDescription != null && !careerDescription.isBlank()) {
            sb.append("Goal Scope: ").append(careerDescription).append("\n");
        }

        sb.append("\nAuthoritative Readiness Score: ").append(readinessScore != null ? readinessScore : 0).append("%\n");
        sb.append("Authoritative Recommended Next Skill to Learn: ").append(recommendedNextSkill != null ? recommendedNextSkill : "Core Fundamentals").append("\n");

        sb.append("\nCurrent Skills:\n");
        if (skills.isEmpty()) {
            sb.append("- No technical skills logged yet.\n");
        } else {
            for (SkillSummary s : skills) {
                sb.append("- ").append(s.getSkillName()).append(" (Proficiency: ").append(s.getProficiency())
                  .append(", Experience: ").append(s.getExperience()).append(" yrs)\n");
            }
        }

        sb.append("\nAuthoritative Skill Gaps:\n");
        if (skillGaps.isEmpty()) {
            sb.append("- All required skills benchmarked and met.\n");
        } else {
            for (GapSummary g : skillGaps) {
                sb.append("- ").append(g.getSkillName())
                  .append(" [Required: Level ").append(g.getRequiredLevel())
                  .append(", Current: Level ").append(g.getCurrentLevel())
                  .append(", Gap: ").append(g.getGapLevel())
                  .append(", Severity: ").append(g.getSeverity()).append("]\n");
            }
        }

        sb.append("\nRoadmap Progress: ").append(overallRoadmapProgress != null ? overallRoadmapProgress : 0).append("%\n");
        if (nextMilestone != null && !nextMilestone.isBlank()) {
            sb.append("Current Focus Milestone: ").append(nextMilestone).append("\n");
        }
        if (!milestones.isEmpty()) {
            sb.append("Milestone Breakdown:\n");
            for (MilestoneSummary m : milestones) {
                sb.append("  * ").append(m.getTitle())
                  .append(" - Status: ").append(m.getStatus())
                  .append(" (").append(m.getProgress()).append("%)\n");
            }
        }

        sb.append("\nProjects:\n");
        if (projects.isEmpty()) {
            sb.append("- None logged yet.\n");
        } else {
            for (ProjectSummary p : projects) {
                sb.append("- ").append(p.getTitle()).append(" [Tech: ").append(p.getTechStack())
                  .append(", Difficulty: ").append(p.getDifficulty())
                  .append(", Status: ").append(p.getStatus()).append("]\n");
            }
        }

        sb.append("\nEngagement & Metrics:\n");
        sb.append("- Completed Projects: ").append(completedProjectsCount != null ? completedProjectsCount : 0).append("\n");
        sb.append("- Skills Tracked/Improved: ").append(skillsImproved != null ? skillsImproved : 0).append("\n");
        sb.append("- Learning Streak: ").append(learningStreak != null ? learningStreak : 0).append(" days\n");
        sb.append("=============================================\n");

        return sb.toString();
    }
}
