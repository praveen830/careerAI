package com.careerai.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String degree;
    private String branch;
    private String college;
    private String currentYear;
    private Double cgpa;
    private Integer graduationYear;
    private Integer profileCompletion;
}
