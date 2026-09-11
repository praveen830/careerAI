package com.careerai.dto.settings;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettingsRequest {
    private Boolean emailNotifications;
    private Boolean learningReminders;
    private Boolean weeklyProgress;
    private String appearance; // 'light', 'dark', 'system'
}
