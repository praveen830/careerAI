package com.careerai.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeeklyProgressResponse {
    private String day;
    private Double hours;
    private Integer tasksCompleted;
}
