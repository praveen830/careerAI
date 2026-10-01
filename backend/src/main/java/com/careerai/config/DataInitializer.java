package com.careerai.config;

import com.careerai.entity.StudentProfile;
import com.careerai.entity.User;
import com.careerai.entity.UserSettings;
import com.careerai.repository.StudentProfileRepository;
import com.careerai.repository.UserRepository;
import com.careerai.repository.UserSettingsRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private UserSettingsRepository userSettingsRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedUserIfNotExists("Praveen Koda", "praveenkoda7@gmail.com", "12345678");
        seedUserIfNotExists("Praveen Koda", "praveenkoda77@gmail.com", "12345678");
        seedUserIfNotExists("Praveen Kumar", "praveen.dev@college.edu", "CareerPass2026!");
    }

    private void seedUserIfNotExists(String fullName, String email, String rawPassword) {
        String cleanEmail = email.toLowerCase().trim();
        if (userRepository.existsByEmail(cleanEmail)) {
            log.info("User {} already exists, updating password if necessary.", cleanEmail);
            userRepository.findByEmail(cleanEmail).ifPresent(u -> {
                u.setPassword(passwordEncoder.encode(rawPassword));
                userRepository.save(u);
            });
            return;
        }

        User user = User.builder()
                .fullName(fullName)
                .email(cleanEmail)
                .password(passwordEncoder.encode(rawPassword))
                .build();
        User savedUser = userRepository.save(user);

        StudentProfile profile = StudentProfile.builder()
                .userId(savedUser.getId())
                .college("National Institute of Technology")
                .degree("B.Tech Computer Science")
                .branch("Computer Science and Engineering")
                .currentYear("3rd Year")
                .cgpa(8.8)
                .graduationYear(2026)
                .phone("+91 9876543210")
                .profileCompletion(80)
                .build();
        studentProfileRepository.save(profile);

        UserSettings settings = UserSettings.builder()
                .userId(savedUser.getId())
                .emailNotifications(true)
                .learningReminders(true)
                .weeklyProgress(true)
                .appearance("light")
                .build();
        userSettingsRepository.save(settings);

        log.info("Seeded user {} with initial profile and settings.", cleanEmail);
    }
}
