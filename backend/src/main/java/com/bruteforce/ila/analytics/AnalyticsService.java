package com.bruteforce.ila.analytics;

import com.bruteforce.ila.analytics.dto.DashboardSummaryResponse;
import com.bruteforce.ila.mastery.MasteryService;
import com.bruteforce.ila.mastery.StudentTopicMastery;
import com.bruteforce.ila.quiz.QuizAttemptRepository;
import com.bruteforce.ila.revision.RevisionSchedulerService;
import com.bruteforce.ila.studyplan.StudyPlanRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    private static final double WEAKNESS_THRESHOLD = 50.0;

    private final MasteryService masteryService;
    private final RevisionSchedulerService revisionSchedulerService;
    private final StudyPlanRepository studyPlanRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    public AnalyticsService(MasteryService masteryService,
                            RevisionSchedulerService revisionSchedulerService,
                            StudyPlanRepository studyPlanRepository,
                            QuizAttemptRepository quizAttemptRepository) {
        this.masteryService = masteryService;
        this.revisionSchedulerService = revisionSchedulerService;
        this.studyPlanRepository = studyPlanRepository;
        this.quizAttemptRepository = quizAttemptRepository;
    }

    public DashboardSummaryResponse getDashboardSummary(Long studentId) {
        List<StudentTopicMastery> allMastery = masteryService.getAllMasteryForStudent(studentId);

        double overallMastery = allMastery.stream()
                .mapToDouble(StudentTopicMastery::getMasteryScore)
                .average()
                .orElse(0.0);

        List<StudentTopicMastery> weakTopics = masteryService.getWeakTopics(studentId, WEAKNESS_THRESHOLD);
        List<String> weakTopicNames = weakTopics.stream()
                .map(m -> m.getTopic().getName())
                .toList();

        int dueForRevisionCount = revisionSchedulerService.getTopicsDueForRevision(studentId).size();

        boolean hasActivePlan = studyPlanRepository.findByStudentIdAndIsActiveTrue(studentId).isPresent();

        int totalQuizAttempts = quizAttemptRepository.findByStudentId(studentId).size();

        return new DashboardSummaryResponse(
                Math.round(overallMastery * 10.0) / 10.0, // round to 1 decimal
                allMastery.size(),
                weakTopics.size(),
                weakTopicNames,
                dueForRevisionCount,
                hasActivePlan,
                totalQuizAttempts);
    }
}