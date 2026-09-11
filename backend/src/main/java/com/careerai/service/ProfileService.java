package com.careerai.service;

import com.careerai.dto.profile.ProfileResponse;
import com.careerai.dto.profile.ProfileUpdateRequest;
import com.careerai.entity.StudentProfile;
import com.careerai.entity.User;
import com.careerai.repository.StudentProfileRepository;
import com.careerai.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class ProfileService {

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    public ProfileResponse getProfile() {
        User user = authService.getAuthenticatedUser();
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultProfile(user));

        return mapToResponse(user, profile);
    }

    @Transactional
    public ProfileResponse updateProfile(ProfileUpdateRequest request) {
        User user = authService.getAuthenticatedUser();
        StudentProfile profile = studentProfileRepository.findByUserId(user.getId())
                .orElseGet(() -> createDefaultProfile(user));

        if (StringUtils.hasText(request.getFullName())) {
            user.setFullName(request.getFullName().trim());
            userRepository.save(user);
        }

        if (request.getPhone() != null) profile.setPhone(request.getPhone());
        if (request.getDegree() != null) profile.setDegree(request.getDegree());
        if (request.getBranch() != null) profile.setBranch(request.getBranch());
        if (request.getCollege() != null) profile.setCollege(request.getCollege());
        if (request.getCurrentYear() != null) profile.setCurrentYear(request.getCurrentYear());
        if (request.getCgpa() != null) profile.setCgpa(request.getCgpa());
        if (request.getGraduationYear() != null) profile.setGraduationYear(request.getGraduationYear());

        profile.setProfileCompletion(calculateCompletion(user, profile));

        StudentProfile saved = studentProfileRepository.save(profile);
        return mapToResponse(user, saved);
    }

    private StudentProfile createDefaultProfile(User user) {
        StudentProfile profile = StudentProfile.builder()
                .userId(user.getId())
                .college("National Institute of Technology")
                .degree("B.Tech Computer Science")
                .branch("Computer Science and Engineering")
                .currentYear("3rd Year")
                .cgpa(8.8)
                .graduationYear(2026)
                .phone("+91 9876543210")
                .profileCompletion(75)
                .build();
        return studentProfileRepository.save(profile);
    }

    private int calculateCompletion(User user, StudentProfile profile) {
        int fields = 0;
        int filled = 0;

        fields++; if (StringUtils.hasText(user.getFullName())) filled++;
        fields++; if (StringUtils.hasText(user.getEmail())) filled++;
        fields++; if (StringUtils.hasText(profile.getPhone())) filled++;
        fields++; if (StringUtils.hasText(profile.getCollege())) filled++;
        fields++; if (StringUtils.hasText(profile.getDegree())) filled++;
        fields++; if (StringUtils.hasText(profile.getBranch())) filled++;
        fields++; if (StringUtils.hasText(profile.getCurrentYear())) filled++;
        fields++; if (profile.getCgpa() != null && profile.getCgpa() > 0) filled++;
        fields++; if (profile.getGraduationYear() != null && profile.getGraduationYear() > 0) filled++;

        return (int) Math.round(((double) filled / fields) * 100);
    }

    private ProfileResponse mapToResponse(User user, StudentProfile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(profile.getPhone())
                .degree(profile.getDegree())
                .branch(profile.getBranch())
                .college(profile.getCollege())
                .currentYear(profile.getCurrentYear())
                .cgpa(profile.getCgpa())
                .graduationYear(profile.getGraduationYear())
                .profileCompletion(profile.getProfileCompletion())
                .build();
    }
}
