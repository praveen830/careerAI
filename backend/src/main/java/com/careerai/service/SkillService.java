package com.careerai.service;

import com.careerai.dto.skill.SkillRequest;
import com.careerai.dto.skill.SkillResponse;
import com.careerai.entity.Skill;
import com.careerai.entity.User;
import com.careerai.exception.DuplicateResourceException;
import com.careerai.exception.ResourceNotFoundException;
import com.careerai.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillService {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private AuthService authService;

    public List<SkillResponse> getAllSkills() {
        User user = authService.getAuthenticatedUser();
        List<Skill> skills = skillRepository.findByUserId(user.getId());

        if (skills.isEmpty()) {
            skills = seedDefaultSkills(user.getId());
        }

        return skills.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public SkillResponse addSkill(SkillRequest request) {
        User user = authService.getAuthenticatedUser();
        String skillName = request.getSkill().trim();

        if (skillRepository.existsByUserIdAndSkillIgnoreCase(user.getId(), skillName)) {
            throw new DuplicateResourceException("Skill '" + skillName + "' already exists for your profile");
        }

        Skill skill = Skill.builder()
                .userId(user.getId())
                .skill(skillName)
                .proficiency(normalizeProficiency(request.getProficiency()))
                .experience(request.getExperience() != null ? request.getExperience() : 1)
                .lastUsed(request.getLastUsed() != null ? request.getLastUsed() : "2026")
                .build();

        Skill saved = skillRepository.save(skill);
        return mapToResponse(saved);
    }

    @Transactional
    public SkillResponse updateSkill(Long id, SkillRequest request) {
        User user = authService.getAuthenticatedUser();
        Skill skill = skillRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        skill.setSkill(request.getSkill().trim());
        skill.setProficiency(normalizeProficiency(request.getProficiency()));
        if (request.getExperience() != null) {
            skill.setExperience(request.getExperience());
        }
        if (request.getLastUsed() != null) {
            skill.setLastUsed(request.getLastUsed());
        }

        Skill saved = skillRepository.save(skill);
        return mapToResponse(saved);
    }

    @Transactional
    public void deleteSkill(Long id) {
        User user = authService.getAuthenticatedUser();
        Skill skill = skillRepository.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));

        skillRepository.delete(skill);
    }

    private String normalizeProficiency(String proficiency) {
        if (proficiency == null || proficiency.isBlank()) {
            return "Intermediate";
        }
        String p = proficiency.trim().toLowerCase();
        return switch (p) {
            case "beginner" -> "Beginner";
            case "basic" -> "Basic";
            case "intermediate" -> "Intermediate";
            case "advanced" -> "Advanced";
            case "expert" -> "Expert";
            default -> Character.toUpperCase(p.charAt(0)) + p.substring(1);
        };
    }

    private List<Skill> seedDefaultSkills(Long userId) {
        List<Skill> defaults = List.of(
                Skill.builder().userId(userId).skill("Python").proficiency("Advanced").experience(2).lastUsed("2026").build(),
                Skill.builder().userId(userId).skill("FastAPI").proficiency("Intermediate").experience(1).lastUsed("2026").build(),
                Skill.builder().userId(userId).skill("Angular").proficiency("Intermediate").experience(2).lastUsed("2026").build(),
                Skill.builder().userId(userId).skill("PostgreSQL").proficiency("Advanced").experience(2).lastUsed("2026").build(),
                Skill.builder().userId(userId).skill("Docker").proficiency("Beginner").experience(1).lastUsed("2025").build(),
                Skill.builder().userId(userId).skill("REST API").proficiency("Intermediate").experience(2).lastUsed("2026").build()
        );
        return skillRepository.saveAll(defaults);
    }

    public SkillResponse mapToResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .userId(skill.getUserId())
                .skill(skill.getSkill())
                .proficiency(skill.getProficiency())
                .experience(skill.getExperience())
                .lastUsed(skill.getLastUsed())
                .build();
    }
}
