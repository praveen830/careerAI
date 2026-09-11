package com.careerai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "career_goals")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CareerGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "career_name", nullable = false)
    private String careerName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "selected", nullable = false)
    private Boolean selected;

    public String getTitle() {
        return careerName;
    }
}
