package com.careerai.dto.dashboard;

import com.careerai.dto.skill.SkillResponse;
import com.careerai.dto.skillgap.SkillGapItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {
    private String studentName;
    private String careerGoal;
    private Integer readinessScore;
    private List<SkillResponse> skills;
    private List<SkillGapItem> skillGaps;
    private Integer roadmapProgress;
    private String recommendedNextSkill;
}
