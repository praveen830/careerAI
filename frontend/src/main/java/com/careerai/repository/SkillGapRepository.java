package com.careerai.repository;

import com.careerai.entity.SkillGap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGapRepository extends JpaRepository<SkillGap, Long> {
    List<SkillGap> findByUserId(Long userId);
    void deleteByUserId(Long userId);
}
