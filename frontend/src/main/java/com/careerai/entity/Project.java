package com.careerai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "projects")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "technologies", nullable = false)
    private String technologies;

    @Column(name = "difficulty", nullable = false)
    private String difficulty;

    @Column(name = "duration")
    private String duration;

    @Column(name = "reason", columnDefinition = "TEXT")
    private String reason;

    @Column(name = "bookmarked", nullable = false)
    @Builder.Default
    private Boolean bookmarked = false;

    @Column(name = "added_to_roadmap", nullable = false)
    @Builder.Default
    private Boolean addedToRoadmap = false;

    @Column(name = "status", nullable = false)
    @Builder.Default
    private String status = "RECOMMENDED";
}
