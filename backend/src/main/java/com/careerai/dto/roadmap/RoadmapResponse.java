package com.careerai.dto.roadmap;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoadmapResponse {
    private Long id;
    private String title;
    private String description;
    private String status; // NOT_STARTED, IN_PROGRESS, COMPLETED
    private Integer progress;
    private Integer estimatedDays;
    private Integer orderIndex;
}
