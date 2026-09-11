package com.careerai.dto.resume;

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
public class ResumeResponse {
    private Long id;
    private String fileName;
    private Long fileSize;
    private Integer resumeScore;
    private String resumeStatus; // STRONG, MODERATE, NEEDS_IMPROVEMENT
    private List<String> skillsFound;
    private List<String> missingSkills;
    private List<String> suggestions;
    private LocalDateTime createdAt;
}
