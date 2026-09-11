package com.careerai.controller;

import com.careerai.dto.common.ApiResponse;
import com.careerai.dto.resume.ResumeAnalysisRequest;
import com.careerai.dto.resume.ResumeResponse;
import com.careerai.entity.User;
import com.careerai.service.AuthService;
import com.careerai.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;
    private final AuthService authService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<ResumeResponse>> uploadResume(
            @RequestParam("file") MultipartFile file) {
        User user = authService.getAuthenticatedUser();
        ResumeResponse response = resumeService.uploadAndAnalyze(user.getId(), file);
        return ResponseEntity.ok(ApiResponse.ok("Resume analyzed successfully", response));
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<ResumeResponse>> analyzeResumeText(
            @RequestBody ResumeAnalysisRequest request) {
        User user = authService.getAuthenticatedUser();
        ResumeResponse response = resumeService.analyzeText(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Resume text analyzed successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<ResumeResponse>> getResume() {
        User user = authService.getAuthenticatedUser();
        ResumeResponse response = resumeService.getLatestResume(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Resume analysis retrieved successfully", response));
    }

    @GetMapping("/latest")
    public ResponseEntity<ApiResponse<ResumeResponse>> getLatestResume() {
        return getResume();
    }
}
