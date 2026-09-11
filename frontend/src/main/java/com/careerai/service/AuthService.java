package com.careerai.service;

import com.careerai.dto.auth.AuthResponse;
import com.careerai.dto.auth.LoginRequest;
import com.careerai.dto.auth.RefreshTokenRequest;
import com.careerai.dto.auth.RegisterRequest;
import com.careerai.dto.auth.UserSummary;
import com.careerai.entity.StudentProfile;
import com.careerai.entity.User;
import com.careerai.entity.UserSettings;
import com.careerai.exception.DuplicateResourceException;
import com.careerai.exception.ResourceNotFoundException;
import com.careerai.exception.ValidationException;
import com.careerai.repository.StudentProfileRepository;
import com.careerai.repository.UserRepository;
import com.careerai.repository.UserSettingsRepository;
import com.careerai.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new ValidationException("Passwords do not match");
        }

        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account with email " + request.getEmail() + " already exists");
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        User savedUser = userRepository.save(user);

        // Seed initial default StudentProfile
        StudentProfile profile = StudentProfile.builder()
                .userId(savedUser.getId())
                .college("National Institute of Technology")
                .degree("B.Tech Computer Science")
                .branch("Computer Science and Engineering")
                .currentYear("3rd Year")
                .cgpa(8.8)
                .graduationYear(2026)
                .phone("+91 9876543210")
                .profileCompletion(75)
                .build();
        studentProfileRepository.save(profile);

        // Seed initial default UserSettings
        UserSettings settings = UserSettings.builder()
                .userId(savedUser.getId())
                .emailNotifications(true)
                .learningReminders(true)
                .weeklyProgress(true)
                .appearance("light")
                .build();
        userSettingsRepository.save(settings);

        return buildAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().toLowerCase().trim();

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return buildAuthResponse(user);
    }

    public AuthResponse refresh(RefreshTokenRequest request, String authHeader) {
        String tokenToValidate = null;

        if (request != null && StringUtils.hasText(request.getRefreshToken())) {
            tokenToValidate = request.getRefreshToken().trim();
        } else if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            tokenToValidate = authHeader.substring(7);
        }

        if (!StringUtils.hasText(tokenToValidate) || !tokenProvider.validateToken(tokenToValidate)) {
            throw new ValidationException("Invalid or expired refresh token");
        }

        String email = tokenProvider.getEmailFromToken(tokenToValidate);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for token"));

        return buildAuthResponse(user);
    }

    public User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new ResourceNotFoundException("No authenticated user found in security context");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private AuthResponse buildAuthResponse(User user) {
        String token = tokenProvider.generateTokenFromEmail(user.getEmail());
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        UserSummary summary = UserSummary.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .user(summary)
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build();
    }
}
