package com.careerai.dto.project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> technologies;
    private String difficulty;
    private String duration;
    private String reason;
    private Boolean bookmarked;
    private Boolean addedToRoadmap;
    private String status;
}
