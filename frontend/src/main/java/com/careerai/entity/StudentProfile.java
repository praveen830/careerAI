package com.careerai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "student_profiles")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "phone")
    private String phone;

    @Column(name = "degree")
    private String degree;

    @Column(name = "branch")
    private String branch;

    @Column(name = "college")
    private String college;

    @Column(name = "current_year")
    private String currentYear;

    @Column(name = "cgpa")
    private Double cgpa;

    @Column(name = "graduation_year")
    private Integer graduationYear;

    @Column(name = "profile_completion")
    private Integer profileCompletion;
}
