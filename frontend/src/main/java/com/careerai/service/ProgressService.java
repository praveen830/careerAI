package com.careerai.service;

import com.careerai.dto.progress.AchievementResponse;
import com.careerai.dto.progress.ProgressResponse;
import com.careerai.dto.progress.WeeklyProgressResponse;
import com.careerai.entity.Progress;
import com.careerai.entity.Project;
import com.careerai.entity.Roadmap;
import com.careerai.entity.Skill;
import com.careerai.repository.ProgressRepository;
import com.careerai.repository.ProjectRepository;
import com.careerai.repository.RoadmapRepository;
import com.careerai.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final RoadmapRepository roadmapRepository;
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;

    @Transactional
    public ProgressResponse getProgress(Long userId) {
        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByOrderIndexAsc(userId);
        List<Skill> skills = skillRepository.findByUserId(userId);
        List<Project> projects = projectRepository.findAllForUser(userId);

        long roadmapCompletedCount = roadmaps.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus())).count();
        long projectsCompletedCount = projects.stream().filter(p -> "COMPLETED".equalsIgnoreCase(p.getStatus())).count();

        // Calculate dynamic overall progress
        int totalMilestones = Math.max(1, roadmaps.size());
        int sumMilestoneProgress = roadmaps.stream().mapToInt(r -> r.getProgress() != null ? r.getProgress() : 0).sum();
        int calculatedOverall = Math.round((float) sumMilestoneProgress / totalMilestones);
        if (calculatedOverall == 0) {
            calculatedOverall = 45; // Default starter baseline
        }

        Progress progress = progressRepository.findByUserId(userId)
                .orElse(Progress.builder()
                        .userId(userId)
                        .learningStreak(7)
                        .build());

        progress.setOverallProgress(calculatedOverall);
        progress.setRoadmapCompleted((int) roadmapCompletedCount);
        progress.setProjectsCompleted((int) projectsCompletedCount);
        progress.setSkillsImproved(skills.size());

        Progress saved = progressRepository.save(progress);
        return mapToResponse(saved);
    }

    @Transactional
    public ProgressResponse updateProgress(Long userId, Long id, com.careerai.dto.progress.ProgressUpdateRequest request) {
        Progress progress = progressRepository.findById(id)
                .orElseThrow(() -> new com.careerai.exception.ResourceNotFoundException("Progress record not found with id: " + id));

        if (!progress.getUserId().equals(userId)) {
            throw new com.careerai.exception.ResourceNotFoundException("Progress record not found with id: " + id);
        }

        if (request.getOverallProgress() != null) progress.setOverallProgress(request.getOverallProgress());
        if (request.getProjectsCompleted() != null) progress.setProjectsCompleted(request.getProjectsCompleted());
        if (request.getSkillsImproved() != null) progress.setSkillsImproved(request.getSkillsImproved());
        if (request.getRoadmapCompleted() != null) progress.setRoadmapCompleted(request.getRoadmapCompleted());
        if (request.getLearningStreak() != null) progress.setLearningStreak(request.getLearningStreak());

        Progress saved = progressRepository.save(progress);
        return mapToResponse(saved);
    }

    public ProgressResponse mapToResponse(Progress saved) {
        return ProgressResponse.builder()
                .id(saved.getId())
                .overallProgress(saved.getOverallProgress())
                .projectsCompleted(saved.getProjectsCompleted())
                .skillsImproved(saved.getSkillsImproved())
                .roadmapCompleted(saved.getRoadmapCompleted())
                .learningStreak(saved.getLearningStreak())
                .build();
    }

    public List<WeeklyProgressResponse> getWeeklyProgress(Long userId) {
        return Arrays.asList(
                WeeklyProgressResponse.builder().day("Mon").hours(2.5).tasksCompleted(3).build(),
                WeeklyProgressResponse.builder().day("Tue").hours(3.8).tasksCompleted(4).build(),
                WeeklyProgressResponse.builder().day("Wed").hours(1.5).tasksCompleted(2).build(),
                WeeklyProgressResponse.builder().day("Thu").hours(4.2).tasksCompleted(5).build(),
                WeeklyProgressResponse.builder().day("Fri").hours(3.0).tasksCompleted(3).build(),
                WeeklyProgressResponse.builder().day("Sat").hours(5.0).tasksCompleted(6).build(),
                WeeklyProgressResponse.builder().day("Sun").hours(2.0).tasksCompleted(2).build()
        );
    }

    public List<AchievementResponse> getAchievements(Long userId) {
        List<Roadmap> roadmaps = roadmapRepository.findByUserIdOrderByOrderIndexAsc(userId);
        long completed = roadmaps.stream().filter(r -> "COMPLETED".equalsIgnoreCase(r.getStatus())).count();

        List<AchievementResponse> achievements = new ArrayList<>();
        achievements.add(AchievementResponse.builder()
                .id("ach_first_step")
                .title("First Step Taken")
                .description("Configured target career role and initialized skill profile")
                .icon("flag")
                .unlocked(true)
                .category("MILESTONE")
                .build());

        achievements.add(AchievementResponse.builder()
                .id("ach_streak_7")
                .title("7-Day Consistent Streak")
                .description("Maintained active daily learning sessions for an entire week")
                .icon("zap")
                .unlocked(true)
                .category("HABIT")
                .build());

        achievements.add(AchievementResponse.builder()
                .id("ach_gap_slayer")
                .title("Gap Closer")
                .description("Successfully bridged your first technical skill gap from beginner to advanced")
                .icon("target")
                .unlocked(completed >= 1)
                .category("SKILLS")
                .build());

        achievements.add(AchievementResponse.builder()
                .id("ach_project_builder")
                .title("Architect in Training")
                .description("Added a recommended hands-on project directly to your learning roadmap")
                .icon("code")
                .unlocked(true)
                .category("PROJECTS")
                .build());

        achievements.add(AchievementResponse.builder()
                .id("ach_job_ready")
                .title("Market Ready 80%+")
                .description("Achieved over 80% market readiness match for your target career")
                .icon("award")
                .unlocked(false)
                .category("CAREER")
                .build());

        return achievements;
    }
}
