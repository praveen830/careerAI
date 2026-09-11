package com.careerai.service;

import com.careerai.dto.settings.UserSettingsRequest;
import com.careerai.dto.settings.UserSettingsResponse;
import com.careerai.entity.UserSettings;
import com.careerai.repository.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SettingsService {

    private final UserSettingsRepository userSettingsRepository;

    @Transactional(readOnly = true)
    public UserSettingsResponse getSettings(Long userId) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElse(UserSettings.builder()
                        .userId(userId)
                        .emailNotifications(true)
                        .learningReminders(true)
                        .weeklyProgress(true)
                        .appearance("light")
                        .build());
        return mapToResponse(settings);
    }

    @Transactional
    public UserSettingsResponse updateSettings(Long userId, UserSettingsRequest request) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElse(UserSettings.builder()
                        .userId(userId)
                        .build());

        if (request.getEmailNotifications() != null) {
            settings.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getLearningReminders() != null) {
            settings.setLearningReminders(request.getLearningReminders());
        }
        if (request.getWeeklyProgress() != null) {
            settings.setWeeklyProgress(request.getWeeklyProgress());
        }
        if (request.getAppearance() != null && !request.getAppearance().isBlank()) {
            settings.setAppearance(request.getAppearance());
        }

        UserSettings saved = userSettingsRepository.save(settings);
        return mapToResponse(saved);
    }

    private UserSettingsResponse mapToResponse(UserSettings settings) {
        return UserSettingsResponse.builder()
                .emailNotifications(settings.getEmailNotifications() != null ? settings.getEmailNotifications() : true)
                .learningReminders(settings.getLearningReminders() != null ? settings.getLearningReminders() : true)
                .weeklyProgress(settings.getWeeklyProgress() != null ? settings.getWeeklyProgress() : true)
                .appearance(settings.getAppearance() != null ? settings.getAppearance() : "light")
                .build();
    }
}
