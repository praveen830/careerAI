package com.careerai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "skill_gaps")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SkillGap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "career_goal")
    private String careerGoal;

    @Column(name = "skill_name", nullable = false)
    private String skillName;

    @Column(name = "current_level", nullable = false)
    private Integer currentLevel;

    @Column(name = "required_level", nullable = false)
    private Integer requiredLevel;

    @Column(name = "gap_level", nullable = false)
    private Integer gapLevel;

    @Column(name = "severity", nullable = false)
    private String severity;

    // Backwards compatibility aliases for existing codebase callers
    public String getSkill() {
        return skillName;
    }

    public void setSkill(String skill) {
        this.skillName = skill;
    }

    public Integer getGap() {
        return gapLevel;
    }

    public void setGap(Integer gap) {
        this.gapLevel = gap;
    }

    public String getStatus() {
        return severity;
    }

    public void setStatus(String status) {
        this.severity = status;
    }

    // Custom builder support for legacy calls using .skill(), .gap(), .status()
    public static class SkillGapBuilder {
        public SkillGapBuilder skill(String skill) {
            this.skillName = skill;
            return this;
        }

        public SkillGapBuilder gap(Integer gap) {
            this.gapLevel = gap;
            return this;
        }

        public SkillGapBuilder status(String status) {
            this.severity = status;
            return this;
        }
    }
}
