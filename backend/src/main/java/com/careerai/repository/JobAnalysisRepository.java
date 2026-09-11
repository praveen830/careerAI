package com.careerai.repository;

import com.careerai.entity.JobAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobAnalysisRepository extends JpaRepository<JobAnalysis, Long> {
    Optional<JobAnalysis> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    java.util.List<JobAnalysis> findByUserIdOrderByCreatedAtDesc(Long userId);
}
