package com.careerai.dto.skillgap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapSummaryResponse {
    private String targetCareer;
    private Integer readinessScore;
    private Integer strongSkillsCount;
    private Integer developingSkillsCount;
    private Integer criticalGapsCount;
    private List<SkillGapItem> gaps;

    public String getCareerGoal() {
        return targetCareer;
    }

    public List<SkillGapItem> getSkillGaps() {
        return gaps;
    }
}
