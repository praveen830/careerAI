package com.careerai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "progress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Progress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "overall_progress", nullable = false)
    @Builder.Default
    private Integer overallProgress = 0;

    @Column(name = "projects_completed", nullable = false)
    @Builder.Default
    private Integer projectsCompleted = 0;

    @Column(name = "skills_improved", nullable = false)
    @Builder.Default
    private Integer skillsImproved = 0;

    @Column(name = "roadmap_completed", nullable = false)
    @Builder.Default
    private Integer roadmapCompleted = 0;

    @Column(name = "learning_streak", nullable = false)
    @Builder.Default
    private Integer learningStreak = 1;
}
