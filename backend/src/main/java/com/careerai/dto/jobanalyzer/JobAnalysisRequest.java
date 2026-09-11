package com.careerai.dto.jobanalyzer;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobAnalysisRequest {
    @NotBlank(message = "Job description cannot be empty")
    private String jobDescription;

    private String roleTitle;
}
