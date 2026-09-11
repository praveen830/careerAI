package com.careerai.dto.skill;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillRequest {

    @NotBlank(message = "Skill is required")
    private String skill;

    @NotBlank(message = "Proficiency is required")
    @Pattern(regexp = "^(?i)(Beginner|Basic|Intermediate|Advanced|Expert)$",
             message = "Proficiency must be one of: Beginner, Basic, Intermediate, Advanced, Expert")
    private String proficiency;

    @Min(value = 0, message = "Experience cannot be negative")
    private Integer experience;

    private String lastUsed;
}
