package com.careerai.controller;

import com.careerai.dto.career.CareerGoalResponse;
import com.careerai.dto.career.CareerGoalSelectionRequest;
import com.careerai.dto.common.ApiResponse;
import com.careerai.service.CareerGoalService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career-goals")
public class CareerGoalController {

    @Autowired
    private CareerGoalService careerGoalService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CareerGoalResponse>>> getCareerGoals() {
        List<CareerGoalResponse> goals = careerGoalService.getCareerGoals();
        return ResponseEntity.ok(ApiResponse.success("Career goals retrieved successfully", goals));
    }

    @GetMapping("/current")
    public ResponseEntity<ApiResponse<CareerGoalResponse>> getCurrentCareerGoal() {
        CareerGoalResponse response = careerGoalService.getSelectedCareerGoal();
        return ResponseEntity.ok(ApiResponse.success("Current career goal retrieved successfully", response));
    }

    @PutMapping("/current")
    public ResponseEntity<ApiResponse<CareerGoalResponse>> updateCurrentCareerGoal(
            @Valid @RequestBody CareerGoalSelectionRequest request) {
        CareerGoalResponse response = careerGoalService.selectCareerGoal(request);
        return ResponseEntity.ok(ApiResponse.success("Career goal updated successfully", response));
    }

    // Backwards compatibility endpoints
    @GetMapping("/selected")
    public ResponseEntity<ApiResponse<CareerGoalResponse>> getSelectedCareerGoal() {
        return getCurrentCareerGoal();
    }

    @PostMapping("/select")
    public ResponseEntity<ApiResponse<CareerGoalResponse>> selectCareerGoal(
            @Valid @RequestBody CareerGoalSelectionRequest request) {
        return updateCurrentCareerGoal(request);
    }
}
