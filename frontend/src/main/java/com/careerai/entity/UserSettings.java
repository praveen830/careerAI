package com.careerai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user_settings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "email_notifications")
    private Boolean emailNotifications;

    @Column(name = "learning_reminders")
    private Boolean learningReminders;

    @Column(name = "weekly_progress")
    private Boolean weeklyProgress;

    @Column(name = "appearance")
    private String appearance;
}
