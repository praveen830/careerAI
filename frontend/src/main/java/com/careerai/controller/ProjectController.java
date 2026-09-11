package com.careerai.controller;

import com.careerai.dto.common.ApiResponse;
import com.careerai.dto.project.ProjectResponse;
import com.careerai.entity.User;
import com.careerai.service.AuthService;
import com.careerai.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getProjects() {
        User user = authService.getAuthenticatedUser();
        List<ProjectResponse> projects = projectService.getProjects(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Projects retrieved successfully", projects));
    }

    @GetMapping("/recommended")
    public ResponseEntity<ApiResponse<List<ProjectResponse>>> getRecommendedProjects() {
        User user = authService.getAuthenticatedUser();
        List<ProjectResponse> projects = projectService.getRecommendedProjects(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("Recommended projects retrieved successfully", projects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectResponse>> getProjectById(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        ProjectResponse project = projectService.getProjectById(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Project retrieved successfully", project));
    }

    @PostMapping("/{id}/bookmark")
    public ResponseEntity<ApiResponse<ProjectResponse>> toggleBookmark(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        ProjectResponse project = projectService.toggleBookmark(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Project bookmark toggled successfully", project));
    }

    @PostMapping("/{id}/roadmap")
    public ResponseEntity<ApiResponse<ProjectResponse>> addToRoadmap(@PathVariable Long id) {
        User user = authService.getAuthenticatedUser();
        ProjectResponse project = projectService.addToRoadmap(user.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Project added to roadmap successfully", project));
    }
}
