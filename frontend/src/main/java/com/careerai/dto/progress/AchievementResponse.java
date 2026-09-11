package com.careerai.dto.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AchievementResponse {
    private String id;
    private String title;
    private String description;
    private String icon;
    private Boolean unlocked;
    private String category;
}
