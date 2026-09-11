package com.careerai.service;

import com.careerai.dto.career.CareerGoalResponse;
import com.careerai.dto.career.CareerGoalSelectionRequest;
import com.careerai.dto.career.CareerGoalType;
import com.careerai.entity.CareerGoal;
import com.careerai.entity.User;
import com.careerai.repository.CareerGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CareerGoalService {

    @Autowired
    private CareerGoalRepository careerGoalRepository;

    @Autowired
    private AuthService authService;

    public List<CareerGoalResponse> getCareerGoals() {
        User user = authService.getAuthenticatedUser();
        List<CareerGoal> goals = careerGoalRepository.findByUserId(user.getId());

        if (goals.isEmpty()) {
            goals = seedDefaultGoals(user.getId());
        }

        return goals.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public CareerGoalResponse selectCareerGoal(CareerGoalSelectionRequest request) {
        User user = authService.getAuthenticatedUser();
        List<CareerGoal> goals = careerGoalRepository.findByUserId(user.getId());

        if (goals.isEmpty()) {
            goals = seedDefaultGoals(user.getId());
        }

        String targetStr = request != null ? request.getTargetGoal() : "JAVA_FULL_STACK_DEVELOPER";
        CareerGoalType goalType = CareerGoalType.fromString(targetStr);

        CareerGoal targetGoal = null;
        for (CareerGoal g : goals) {
            boolean matches = g.getCareerName().equalsIgnoreCase(goalType.getDisplayName())
                    || g.getCareerName().equalsIgnoreCase(goalType.name())
                    || g.getCareerName().equalsIgnoreCase(targetStr);

            if (matches) {
                g.setSelected(true);
                targetGoal = g;
            } else {
                g.setSelected(false);
            }
        }

        if (targetGoal == null) {
            targetGoal = CareerGoal.builder()
                    .userId(user.getId())
                    .careerName(goalType.getDisplayName())
                    .description(goalType.getDefaultDescription())
                    .selected(true)
                    .build();
            goals.add(targetGoal);
        }

        careerGoalRepository.saveAll(goals);
        return mapToResponse(targetGoal);
    }

    public CareerGoalResponse getSelectedCareerGoal() {
        User user = authService.getAuthenticatedUser();
        CareerGoal selected = careerGoalRepository.findByUserIdAndSelectedTrue(user.getId())
                .orElseGet(() -> {
                    List<CareerGoal> seeded = seedDefaultGoals(user.getId());
                    return seeded.get(0);
                });

        return mapToResponse(selected);
    }

    private List<CareerGoal> seedDefaultGoals(Long userId) {
        List<CareerGoal> defaults = List.of(
                CareerGoal.builder().userId(userId).careerName("Java Full Stack Developer").description(CareerGoalType.JAVA_FULL_STACK_DEVELOPER.getDefaultDescription()).selected(true).build(),
                CareerGoal.builder().userId(userId).careerName("Frontend Developer").description(CareerGoalType.FRONTEND_DEVELOPER.getDefaultDescription()).selected(false).build(),
                CareerGoal.builder().userId(userId).careerName("Data Analyst").description(CareerGoalType.DATA_ANALYST.getDefaultDescription()).selected(false).build(),
                CareerGoal.builder().userId(userId).careerName("AI/ML Engineer").description(CareerGoalType.AI_ML_ENGINEER.getDefaultDescription()).selected(false).build(),
                CareerGoal.builder().userId(userId).careerName("DevOps Engineer").description(CareerGoalType.DEVOPS_ENGINEER.getDefaultDescription()).selected(false).build()
        );
        return careerGoalRepository.saveAll(defaults);
    }

    public CareerGoalResponse mapToResponse(CareerGoal goal) {
        CareerGoalType type = CareerGoalType.fromString(goal.getCareerName());
        return CareerGoalResponse.builder()
                .id(goal.getId())
                .userId(goal.getUserId())
                .careerGoal(type.name())
                .careerName(goal.getCareerName())
                .title(goal.getCareerName())
                .description(goal.getDescription())
                .selected(goal.getSelected())
                .build();
    }
}
