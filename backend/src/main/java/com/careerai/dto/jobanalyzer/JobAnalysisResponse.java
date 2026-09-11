package com.careerai.dto.jobanalyzer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobAnalysisResponse {
    private Long id;

    /**
     * Exact required property name: matchScore
     */
    private Integer matchScore;

    /**
     * Exact required property name: matchedSkills
     */
    private List<String> matchedSkills;

    /**
     * Exact required property name: missingSkills
     */
    private List<String> missingSkills;

    private String status;
    private String recommendation;
    private LocalDateTime createdAt;

    // Backwards compatibility aliases
    public Integer getJobMatch() {
        return matchScore;
    }

    public List<String> getMatchingSkills() {
        return matchedSkills;
    }
}
