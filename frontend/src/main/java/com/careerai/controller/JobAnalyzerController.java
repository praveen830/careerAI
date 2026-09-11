package com.careerai.controller;

import com.careerai.dto.common.ApiResponse;
import com.careerai.dto.jobanalyzer.JobAnalysisRequest;
import com.careerai.dto.jobanalyzer.JobAnalysisResponse;
import com.careerai.entity.User;
import com.careerai.service.AuthService;
import com.careerai.service.JobAnalyzerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-analyzer")
@RequiredArgsConstructor
public class JobAnalyzerController {

    private final JobAnalyzerService jobAnalyzerService;
    private final AuthService authService;

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<JobAnalysisResponse>> analyzeJob(
            @Valid @RequestBody JobAnalysisRequest request) {
        User user = authService.getAuthenticatedUser();
        JobAnalysisResponse response = jobAnalyzerService.analyzeJob(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Job description analyzed successfully", response));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<JobAnalysisResponse>> getLatestAnalysis() {
        User user = authService.getAuthenticatedUser();
        JobAnalysisResponse response = jobAnalyzerService.getLatestAnalysis(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Latest job analysis retrieved successfully", response));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<JobAnalysisResponse>>> getJobHistory() {
        User user = authService.getAuthenticatedUser();
        List<JobAnalysisResponse> history = jobAnalyzerService.getJobHistory(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Job analysis history retrieved successfully", history));
    }
}
