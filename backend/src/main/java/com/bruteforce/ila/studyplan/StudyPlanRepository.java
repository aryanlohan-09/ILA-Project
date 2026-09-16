package com.bruteforce.ila.studyplan;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {

    // Finds the current plan for a student (there should only ever be one active at a time)
    Optional<StudyPlan> findByStudentIdAndIsActiveTrue(Long studentId);

    // Full history of every plan ever generated for a student - useful to show "before vs after"
    List<StudyPlan> findByStudentIdOrderByGeneratedAtDesc(Long studentId);
}