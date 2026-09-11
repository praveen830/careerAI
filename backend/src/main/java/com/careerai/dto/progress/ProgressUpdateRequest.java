package com.careerai.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressUpdateRequest {
    private Integer overallProgress;
    private Integer projectsCompleted;
    private Integer skillsImproved;
    private Integer roadmapCompleted;
    private Integer learningStreak;
}
