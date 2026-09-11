package com.careerai.dto.skillgap;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGapItem {
    private String skillName;
    private Integer requiredLevel;
    private Integer currentLevel;
    private Integer gapLevel;
    private String severity;

    // Aliases for backwards compatibility with legacy service callers
    @JsonIgnore
    public String getSkill() {
        return skillName;
    }

    @JsonIgnore
    public Integer getGap() {
        return gapLevel;
    }

    @JsonIgnore
    public String getStatus() {
        return severity;
    }
}
