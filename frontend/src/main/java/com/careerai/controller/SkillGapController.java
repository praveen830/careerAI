package com.careerai.controller;

import com.careerai.dto.common.ApiResponse;
import com.careerai.dto.skillgap.SkillGapRequest;
import com.careerai.dto.skillgap.SkillGapResponse;
import com.careerai.dto.skillgap.SkillGapSummaryResponse;
import com.careerai.service.SkillGapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skill-gap")
public class SkillGapController {

    @Autowired
    private SkillGapService skillGapService;

    @GetMapping
    public ResponseEntity<ApiResponse<SkillGapResponse>> getSkillGaps() {
        SkillGapResponse response = skillGapService.getSkillGapAnalysis();
        return ResponseEntity.ok(ApiResponse.success("Skill gaps retrieved successfully", response));
    }

    @PostMapping("/analyze")
    public ResponseEntity<ApiResponse<SkillGapResponse>> analyzeSkillGap(
            @RequestBody(required = false) SkillGapRequest request) {
        SkillGapResponse response = skillGapService.analyzeSkillGap(request);
        return ResponseEntity.ok(ApiResponse.success("Skill gap analysis completed successfully", response));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<SkillGapSummaryResponse>> getSummary() {
        SkillGapSummaryResponse summary = skillGapService.getSummary();
        return ResponseEntity.ok(ApiResponse.success("Skill gap summary retrieved successfully", summary));
    }
}
