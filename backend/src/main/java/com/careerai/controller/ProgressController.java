package com.careerai.controller;

import com.careerai.dto.common.ApiResponse;
import com.careerai.dto.progress.AchievementResponse;
import com.careerai.dto.progress.ProgressResponse;
import com.careerai.dto.progress.ProgressUpdateRequest;
import com.careerai.dto.progress.WeeklyProgressResponse;
import com.careerai.entity.User;
import com.careerai.service.AuthService;
import com.careerai.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<ProgressResponse>> getProgress() {
        User user = authService.getAuthenticatedUser();
        ProgressResponse response = progressService.getProgress(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Progress metrics retrieved successfully", response));
    }

    @GetMapping("/weekly")
    public ResponseEntity<ApiResponse<List<WeeklyProgressResponse>>> getWeeklyProgress() {
        User user = authService.getAuthenticatedUser();
        List<WeeklyProgressResponse> response = progressService.getWeeklyProgress(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Weekly progress retrieved successfully", response));
    }

    @GetMapping("/achievements")
    public ResponseEntity<ApiResponse<List<AchievementResponse>>> getAchievements() {
        User user = authService.getAuthenticatedUser();
        List<AchievementResponse> response = progressService.getAchievements(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Achievements retrieved successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProgressResponse>> updateProgress(
            @PathVariable Long id,
            @RequestBody ProgressUpdateRequest request) {
        User user = authService.getAuthenticatedUser();
        ProgressResponse response = progressService.updateProgress(user.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Progress updated successfully", response));
    }
}
