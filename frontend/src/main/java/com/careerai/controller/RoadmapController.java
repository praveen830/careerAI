package com.careerai.controller;

import com.careerai.dto.common.ApiResponse;
import com.careerai.dto.roadmap.RoadmapProgressUpdateRequest;
import com.careerai.dto.roadmap.RoadmapResponse;
import com.careerai.entity.User;
import com.careerai.service.AuthService;
import com.careerai.service.RoadmapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roadmap")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoadmapResponse>>> getRoadmap() {
        User user = authService.getAuthenticatedUser();
        List<RoadmapResponse> list = roadmapService.getRoadmap(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Roadmap milestones retrieved successfully", list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoadmapResponse>> getRoadmapById(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        RoadmapResponse res = roadmapService.getRoadmapById(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Roadmap milestone retrieved successfully", res));
    }

    @PutMapping("/{id}/progress")
    public ResponseEntity<ApiResponse<RoadmapResponse>> updateProgress(
            @PathVariable Long id,
            @Valid @RequestBody RoadmapProgressUpdateRequest request) {
        User user = authService.getAuthenticatedUser();
        RoadmapResponse res = roadmapService.updateProgress(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Milestone progress updated successfully", res));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<ApiResponse<RoadmapResponse>> markComplete(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        RoadmapResponse res = roadmapService.markComplete(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Milestone marked as complete", res));
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<List<RoadmapResponse>>> generateRoadmap() {
        User user = authService.getAuthenticatedUser();
        List<RoadmapResponse> list = roadmapService.generateRoadmapForUser(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Roadmap regenerated successfully", list));
    }
}
