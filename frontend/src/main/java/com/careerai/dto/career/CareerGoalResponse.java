package com.careerai.dto.career;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerGoalResponse {
    private Long id;
    private Long userId;

    /**
     * Exact enum-style identifier: JAVA_FULL_STACK_DEVELOPER, FRONTEND_DEVELOPER, etc.
     */
    private String careerGoal;

    /**
     * Display title: e.g. "Java Full Stack Developer"
     */
    private String careerName;

    /**
     * Alias for careerName
     */
    private String title;

    private String description;
    private Boolean selected;
}
