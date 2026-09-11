package com.careerai.dto.skillgap;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapResponse {
    private String careerGoal;
    private Integer readinessScore;
    private List<SkillGapItem> skillGaps;

    // Aliases for compatibility
    @JsonIgnore
    public String getTargetCareer() {
        return careerGoal;
    }

    @JsonIgnore
    public List<SkillGapItem> getGaps() {
        return skillGaps;
    }
}
