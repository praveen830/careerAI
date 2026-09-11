package com.careerai.service;

import com.careerai.dto.career.CareerGoalType;
import com.careerai.dto.skillgap.SkillGapItem;
import com.careerai.dto.skillgap.SkillGapRequest;
import com.careerai.dto.skillgap.SkillGapResponse;
import com.careerai.dto.skillgap.SkillGapSummaryResponse;
import com.careerai.entity.CareerGoal;
import com.careerai.entity.Skill;
import com.careerai.entity.SkillGap;
import com.careerai.entity.User;
import com.careerai.repository.CareerGoalRepository;
import com.careerai.repository.SkillGapRepository;
import com.careerai.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SkillGapService {

    @Autowired
    private SkillGapRepository skillGapRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private CareerGoalRepository careerGoalRepository;

    @Autowired
    private AuthService authService;

    public SkillGapResponse getSkillGapAnalysis() {
        User user = authService.getAuthenticatedUser();
        List<SkillGap> gaps = skillGapRepository.findByUserId(user.getId());

        if (gaps.isEmpty()) {
            gaps = analyzeGapsForUser(user, null);
        }

        return buildSkillGapResponse(user, gaps, null);
    }

    @Transactional
    public SkillGapResponse analyzeSkillGap() {
        return analyzeSkillGap((String) null);
    }

    @Transactional
    public SkillGapResponse analyzeSkillGap(SkillGapRequest request) {
        String targetGoal = request != null ? request.getCareerGoal() : null;
        return analyzeSkillGap(targetGoal);
    }

    @Transactional
    public SkillGapResponse analyzeSkillGap(String targetGoal) {
        User user = authService.getAuthenticatedUser();
        List<SkillGap> gaps = analyzeGapsForUser(user, targetGoal);
        return buildSkillGapResponse(user, gaps, targetGoal);
    }

    public SkillGapSummaryResponse getSummary() {
        User user = authService.getAuthenticatedUser();
        List<SkillGap> gaps = skillGapRepository.findByUserId(user.getId());

        if (gaps.isEmpty()) {
            gaps = analyzeGapsForUser(user, null);
        }

        CareerGoal goal = careerGoalRepository.findByUserIdAndSelectedTrue(user.getId()).orElse(null);
        CareerGoalType goalType = (goal != null) ? CareerGoalType.fromString(goal.getCareerName()) : CareerGoalType.JAVA_FULL_STACK_DEVELOPER;

        int strongCount = 0;
        int developingCount = 0;
        int criticalCount = 0;
        int totalCurrent = 0;
        int totalRequired = 0;

        for (SkillGap g : gaps) {
            int current = g.getCurrentLevel() != null ? g.getCurrentLevel() : 0;
            int required = g.getRequiredLevel() != null ? g.getRequiredLevel() : 0;
            totalCurrent += Math.min(current, required);
            totalRequired += required;

            String sev = g.getSeverity();
            if ("EXCELLENT".equalsIgnoreCase(sev) || "GOOD".equalsIgnoreCase(sev)) {
                strongCount++;
            } else if ("MODERATE".equalsIgnoreCase(sev)) {
                developingCount++;
            } else {
                criticalCount++;
            }
        }

        int readinessScore = totalRequired > 0 ? (int) Math.round(((double) totalCurrent / totalRequired) * 100) : 0;
        readinessScore = Math.max(0, Math.min(100, readinessScore));

        return SkillGapSummaryResponse.builder()
                .targetCareer(goalType.name())
                .readinessScore(readinessScore)
                .strongSkillsCount(strongCount)
                .developingSkillsCount(developingCount)
                .criticalGapsCount(criticalCount)
                .gaps(gaps.stream().map(this::mapToItem).collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public List<SkillGap> analyzeGapsForUser(User user, String targetGoalOverride) {
        skillGapRepository.deleteByUserId(user.getId());

        CareerGoalType goalType;
        if (targetGoalOverride != null && !targetGoalOverride.isBlank()) {
            goalType = CareerGoalType.fromString(targetGoalOverride);
        } else {
            CareerGoal selectedGoal = careerGoalRepository.findByUserIdAndSelectedTrue(user.getId()).orElse(null);
            goalType = (selectedGoal != null) ? CareerGoalType.fromString(selectedGoal.getCareerName()) : CareerGoalType.JAVA_FULL_STACK_DEVELOPER;
        }

        List<Skill> userSkills = skillRepository.findByUserId(user.getId());
        Map<String, Integer> userSkillMap = new HashMap<>();
        for (Skill s : userSkills) {
            String normalizedName = normalizeSkill(s.getSkill());
            int level = convertProficiencyToLevel(s.getProficiency());
            userSkillMap.put(normalizedName, level);
        }

        Map<String, Integer> requiredBenchmarks = getBenchmarksForGoal(goalType);
        List<SkillGap> gaps = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : requiredBenchmarks.entrySet()) {
            String skillName = entry.getKey();
            int requiredLevel = entry.getValue();
            int currentLevel = findUserSkillLevel(userSkillMap, skillName);

            int gapLevel = Math.max(0, requiredLevel - currentLevel);
            String severity = calculateSeverity(gapLevel);

            SkillGap sg = SkillGap.builder()
                    .userId(user.getId())
                    .careerGoal(goalType.name())
                    .skillName(skillName)
                    .currentLevel(currentLevel)
                    .requiredLevel(requiredLevel)
                    .gapLevel(gapLevel)
                    .severity(severity)
                    .build();
            gaps.add(sg);
        }

        return skillGapRepository.saveAll(gaps);
    }

    private int findUserSkillLevel(Map<String, Integer> userSkillMap, String benchmarkSkillName) {
        String normalizedBenchmark = normalizeSkill(benchmarkSkillName);

        // 1. Exact normalized match
        if (userSkillMap.containsKey(normalizedBenchmark)) {
            return userSkillMap.get(normalizedBenchmark);
        }

        // 2. Alias / substring / prefix matching
        for (Map.Entry<String, Integer> entry : userSkillMap.entrySet()) {
            String userKey = entry.getKey();
            if (userKey.equals(normalizedBenchmark)) {
                return entry.getValue();
            }
            if (isAliasMatch(userKey, normalizedBenchmark)) {
                return entry.getValue();
            }
        }

        // Student does not possess the required skill -> default level 0
        return 0;
    }

    private boolean isAliasMatch(String userKey, String benchmarkKey) {
        if (userKey.isEmpty() || benchmarkKey.isEmpty()) return false;

        // E.g., "restapi" and "restapis"
        if (userKey.startsWith(benchmarkKey) || benchmarkKey.startsWith(userKey)) {
            return true;
        }

        // E.g., "gitgithub" contains "git"
        if (userKey.contains(benchmarkKey) || benchmarkKey.contains(userKey)) {
            return true;
        }

        // Specific aliases
        if ((benchmarkKey.equals("mysql") || benchmarkKey.equals("sql")) && (userKey.contains("mysql") || userKey.contains("sql"))) {
            return true;
        }
        if (benchmarkKey.equals("htmlcss") && (userKey.contains("html") || userKey.contains("css"))) {
            return true;
        }
        if (benchmarkKey.equals("javascripttypescript") && (userKey.contains("javascript") || userKey.contains("typescript"))) {
            return true;
        }
        if (benchmarkKey.contains("statemanagement") && (userKey.contains("ngrx") || userKey.contains("signals") || userKey.contains("redux"))) {
            return true;
        }
        if (benchmarkKey.contains("cicd") && (userKey.contains("cicd") || userKey.contains("githubactions") || userKey.contains("jenkins"))) {
            return true;
        }
        if (benchmarkKey.contains("aws") && (userKey.contains("aws") || userKey.contains("cloud"))) {
            return true;
        }
        if (benchmarkKey.contains("docker") && userKey.contains("docker")) {
            return true;
        }
        if (benchmarkKey.contains("kubernetes") && userKey.contains("kubernetes")) {
            return true;
        }

        return false;
    }

    private String normalizeSkill(String skill) {
        if (skill == null) return "";
        return skill.toLowerCase().replaceAll("[^a-z0-9]", "").trim();
    }

    private SkillGapResponse buildSkillGapResponse(User user, List<SkillGap> gaps, String targetGoalOverride) {
        CareerGoalType goalType;
        if (targetGoalOverride != null && !targetGoalOverride.isBlank()) {
            goalType = CareerGoalType.fromString(targetGoalOverride);
        } else {
            CareerGoal goal = careerGoalRepository.findByUserIdAndSelectedTrue(user.getId()).orElse(null);
            goalType = (goal != null) ? CareerGoalType.fromString(goal.getCareerName()) : CareerGoalType.JAVA_FULL_STACK_DEVELOPER;
        }

        int totalCurrent = 0;
        int totalRequired = 0;

        for (SkillGap g : gaps) {
            int current = g.getCurrentLevel() != null ? g.getCurrentLevel() : 0;
            int required = g.getRequiredLevel() != null ? g.getRequiredLevel() : 0;
            totalCurrent += Math.min(current, required);
            totalRequired += required;
        }

        int readinessScore = totalRequired > 0 ? (int) Math.round(((double) totalCurrent / totalRequired) * 100) : 0;
        readinessScore = Math.max(0, Math.min(100, readinessScore));

        List<SkillGapItem> items = gaps.stream().map(this::mapToItem).collect(Collectors.toList());

        return SkillGapResponse.builder()
                .careerGoal(goalType.name())
                .readinessScore(readinessScore)
                .skillGaps(items)
                .build();
    }

    private int convertProficiencyToLevel(String proficiency) {
        if (proficiency == null || proficiency.isBlank()) return 0;
        String clean = proficiency.toLowerCase().trim();

        // Try numeric conversion if numeric percentage string provided
        try {
            int numeric = Integer.parseInt(clean);
            if (numeric >= 80) return 5;
            if (numeric >= 60) return 4;
            if (numeric >= 40) return 3;
            if (numeric >= 20) return 2;
            if (numeric > 0) return 1;
            return 0;
        } catch (NumberFormatException ignored) {}

        return switch (clean) {
            case "expert" -> 5;
            case "advanced" -> 4;
            case "intermediate" -> 3;
            case "basic" -> 2;
            case "beginner" -> 1;
            default -> 1;
        };
    }

    public String calculateSeverity(int gapLevel) {
        if (gapLevel == 0) return "EXCELLENT";
        if (gapLevel == 1) return "GOOD";
        if (gapLevel == 2) return "MODERATE";
        return "CRITICAL";
    }

    private Map<String, Integer> getBenchmarksForGoal(CareerGoalType goalType) {
        Map<String, Integer> benchmarks = new LinkedHashMap<>();

        switch (goalType) {
            case FRONTEND_DEVELOPER -> {
                benchmarks.put("HTML/CSS", 4);
                benchmarks.put("JavaScript", 4);
                benchmarks.put("TypeScript", 4);
                benchmarks.put("Angular", 4);
                benchmarks.put("State Management", 3);
                benchmarks.put("REST API", 3);
                benchmarks.put("Git", 3);
            }
            case DATA_ANALYST -> {
                benchmarks.put("SQL", 4);
                benchmarks.put("Python", 4);
                benchmarks.put("Power BI", 4);
                benchmarks.put("Excel", 4);
                benchmarks.put("Data Modeling", 3);
                benchmarks.put("Statistics", 3);
            }
            case AI_ML_ENGINEER -> {
                benchmarks.put("Python", 5);
                benchmarks.put("PyTorch", 4);
                benchmarks.put("Scikit-Learn", 4);
                benchmarks.put("Vector Databases", 3);
                benchmarks.put("MLOps & Docker", 3);
                benchmarks.put("Mathematics & Statistics", 3);
            }
            case DEVOPS_ENGINEER -> {
                benchmarks.put("Linux & Bash", 4);
                benchmarks.put("Docker", 4);
                benchmarks.put("Kubernetes", 4);
                benchmarks.put("CI/CD Pipelines", 4);
                benchmarks.put("AWS Cloud", 3);
                benchmarks.put("Git", 3);
            }
            default -> {
                // JAVA_FULL_STACK_DEVELOPER
                benchmarks.put("Java", 4);
                benchmarks.put("Spring Boot", 4);
                benchmarks.put("Spring Security", 4);
                benchmarks.put("REST API", 4);
                benchmarks.put("Angular", 3);
                benchmarks.put("MySQL", 3);
                benchmarks.put("Docker", 3);
                benchmarks.put("Git", 3);
            }
        }
        return benchmarks;
    }

    public SkillGapItem mapToItem(SkillGap sg) {
        return SkillGapItem.builder()
                .skillName(sg.getSkillName())
                .currentLevel(sg.getCurrentLevel())
                .requiredLevel(sg.getRequiredLevel())
                .gapLevel(sg.getGapLevel())
                .severity(sg.getSeverity())
                .build();
    }
}
