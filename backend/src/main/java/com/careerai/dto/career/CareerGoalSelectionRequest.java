package com.careerai.dto.career;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerGoalSelectionRequest {

    /**
     * Exact careerGoal value as specified by frontend contract:
     * e.g. JAVA_FULL_STACK_DEVELOPER, FRONTEND_DEVELOPER, DATA_ANALYST, AI_ML_ENGINEER, DEVOPS_ENGINEER
     */
    private String careerGoal;

    /**
     * Alias for backwards compatibility
     */
    private String careerName;

    public String getTargetGoal() {
        if (careerGoal != null && !careerGoal.isBlank()) {
            return careerGoal.trim();
        }
        if (careerName != null && !careerName.isBlank()) {
            return careerName.trim();
        }
        return "JAVA_FULL_STACK_DEVELOPER";
    }
}
