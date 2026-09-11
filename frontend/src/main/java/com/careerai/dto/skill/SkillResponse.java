package com.careerai.dto.skill;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillResponse {
    private Long id;
    private Long userId;
    private String skill;
    private String proficiency;
    private Integer experience;
    private String lastUsed;
}
