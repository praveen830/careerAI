package com.careerai.repository;

import com.careerai.entity.Roadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoadmapRepository extends JpaRepository<Roadmap, Long> {
    List<Roadmap> findByUserIdOrderByOrderIndexAsc(Long userId);
    Optional<Roadmap> findByIdAndUserId(Long id, Long userId);
    void deleteByUserId(Long userId);
}
