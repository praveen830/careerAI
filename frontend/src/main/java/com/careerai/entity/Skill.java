package com.careerai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "skills")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "skill", nullable = false)
    private String skill;

    @Column(name = "proficiency", nullable = false)
    private String proficiency;

    @Column(name = "experience")
    private Integer experience;

    @Column(name = "last_used")
    private String lastUsed;
}
