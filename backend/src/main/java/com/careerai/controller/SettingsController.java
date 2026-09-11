package com.careerai.controller;

import com.careerai.dto.common.ApiResponse;
import com.careerai.dto.settings.UserSettingsRequest;
import com.careerai.dto.settings.UserSettingsResponse;
import com.careerai.entity.User;
import com.careerai.service.SettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserSettingsResponse>> getSettings(@AuthenticationPrincipal User user) {
        UserSettingsResponse response = settingsService.getSettings(user.getId());
        return ResponseEntity.ok(ApiResponse.ok("User settings retrieved successfully", response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateSettings(
            @AuthenticationPrincipal User user,
            @RequestBody UserSettingsRequest request) {
        UserSettingsResponse response = settingsService.updateSettings(user.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("User settings updated successfully", response));
    }
}
