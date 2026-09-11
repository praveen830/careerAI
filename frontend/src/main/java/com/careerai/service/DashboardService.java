package com.careerai.service;

import com.careerai.dto.career.CareerGoalResponse;
import com.careerai.dto.dashboard.DashboardResponse;
import com.careerai.dto.profile.ProfileResponse;
import com.careerai.dto.progress.ProgressResponse;
import com.careerai.dto.skill.SkillResponse;
import com.careerai.dto.skillgap.SkillGapItem;
import com.careerai.dto.skillgap.SkillGapSummaryResponse;
import com.careerai.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final AuthService authService;
    private final ProfileService profileService;
    private final CareerGoalService careerGoalService;
    private final SkillService skillService;
    private final SkillGapService skillGapService;
    private final ProgressService progressService;

    @Transactional
    public DashboardResponse getDashboardData() {
        User user = authService.getAuthenticatedUser();
        return buildDashboardForUser(user);
    }

    @Transactional
    public DashboardResponse getDashboardData(Long userId) {
        User user = authService.getAuthenticatedUser();
        return buildDashboardForUser(user);
    }

    private DashboardResponse buildDashboardForUser(User user) {
        ProfileResponse profile = profileService.getProfile();
        CareerGoalResponse career = careerGoalService.getSelectedCareerGoal();
        List<SkillResponse> skills = skillService.getAllSkills();
        SkillGapSummaryResponse gapsSummary = skillGapService.getSummary();
        ProgressResponse progress = progressService.getProgress(user.getId());

        String studentName = (profile != null && profile.getFullName() != null && !profile.getFullName().isBlank())
                ? profile.getFullName()
                : (user.getFullName() != null ? user.getFullName() : "Student");

        String careerGoal = (career != null && career.getCareerGoal() != null && !career.getCareerGoal().isBlank())
                ? career.getCareerGoal()
                : "JAVA_FULL_STACK_DEVELOPER";

        Integer readinessScore = (gapsSummary != null && gapsSummary.getReadinessScore() != null)
                ? gapsSummary.getReadinessScore()
                : 68;

        List<SkillGapItem> skillGaps = (gapsSummary != null && gapsSummary.getGaps() != null)
                ? gapsSummary.getGaps()
                : List.of();

        Integer roadmapProgress = (progress != null && progress.getOverallProgress() != null)
                ? progress.getOverallProgress()
                : 42;

        String recommendedNextSkill = determineRecommendedNextSkill(skillGaps);

        return DashboardResponse.builder()
                .studentName(studentName)
                .careerGoal(careerGoal)
                .readinessScore(readinessScore)
                .skills(skills != null ? skills : List.of())
                .skillGaps(skillGaps)
                .roadmapProgress(roadmapProgress)
                .recommendedNextSkill(recommendedNextSkill)
                .build();
    }

    private String determineRecommendedNextSkill(List<SkillGapItem> skillGaps) {
        if (skillGaps == null || skillGaps.isEmpty()) {
            return null;
        }

        return skillGaps.stream()
                .filter(g -> g.getGapLevel() != null && g.getGapLevel() > 0)
                .min(Comparator
                        .comparingInt(this::getSeverityRank)
                        .thenComparing(Comparator.comparingInt((SkillGapItem g) -> g.getGapLevel() != null ? g.getGapLevel() : 0).reversed())
                )
                .map(SkillGapItem::getSkillName)
                .orElse(null);
    }

    private int getSeverityRank(SkillGapItem item) {
        String severity = item.getSeverity() != null ? item.getSeverity().toUpperCase() : "";
        if (severity.contains("CRITICAL")) {
            return 1; // Highest priority
        } else if (severity.contains("HIGH") || severity.contains("MODERATE") || severity.contains("NEEDS_IMPROVEMENT")) {
            return 2;
        } else {
            return 3;
        }
    }
}
