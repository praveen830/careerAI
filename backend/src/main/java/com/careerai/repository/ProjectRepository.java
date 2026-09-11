package com.careerai.repository;

import com.careerai.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT p FROM Project p WHERE p.userId = :userId OR p.userId IS NULL")
    List<Project> findAllForUser(@Param("userId") Long userId);

    Optional<Project> findByIdAndUserId(Long id, Long userId);
}
