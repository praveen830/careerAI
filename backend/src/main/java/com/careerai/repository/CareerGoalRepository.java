package com.careerai.repository;

import com.careerai.entity.CareerGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CareerGoalRepository extends JpaRepository<CareerGoal, Long> {
    List<CareerGoal> findByUserId(Long userId);
    Optional<CareerGoal> findByUserIdAndSelectedTrue(Long userId);
    Optional<CareerGoal> findByUserIdAndCareerName(Long userId, String careerName);
}
