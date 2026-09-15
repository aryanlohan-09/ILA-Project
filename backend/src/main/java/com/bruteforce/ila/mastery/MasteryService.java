package com.bruteforce.ila.mastery;

import com.bruteforce.ila.student.Student;
import com.bruteforce.ila.student.StudentRepository;
import com.bruteforce.ila.syllabus.Topic;
import com.bruteforce.ila.syllabus.TopicRepository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class MasteryService {

    private final StudentTopicMasteryRepository masteryRepository;
    private final StudentRepository studentRepository;
    private final TopicRepository topicRepository;

    public MasteryService(StudentTopicMasteryRepository masteryRepository,
                          StudentRepository studentRepository,
                          TopicRepository topicRepository) {
        this.masteryRepository = masteryRepository;
        this.studentRepository = studentRepository;
        this.topicRepository = topicRepository;
    }

    // Gets existing mastery, or creates a fresh record starting at 50.0 if this is the first time
    public StudentTopicMastery getOrCreateMastery(Long studentId, Long topicId) {
        return masteryRepository.findByStudentIdAndTopicId(studentId, topicId)
                .orElseGet(() -> {
                    Student student = studentRepository.findById(studentId)
                            .orElseThrow(() -> new NoSuchElementException("Student with id " + studentId + " not found."));
                    Topic topic = topicRepository.findById(topicId)
                            .orElseThrow(() -> new NoSuchElementException("Topic with id " + topicId + " not found."));
                    StudentTopicMastery newMastery = new StudentTopicMastery(student, topic);
                    return masteryRepository.save(newMastery);
                });
    }

    // This is called every time a student answers a quiz question
    public StudentTopicMastery recordAnswer(Long studentId, Long topicId, boolean wasCorrect, int difficultyLevel) {
        StudentTopicMastery mastery = getOrCreateMastery(studentId, topicId);

        double newScore = MasteryCalculator.calculateNewMastery(
                mastery.getMasteryScore(), wasCorrect, difficultyLevel);

        mastery.setMasteryScore(newScore);
        mastery.setTotalAttempts(mastery.getTotalAttempts() + 1);
        if (wasCorrect) {
            mastery.setCorrectAttempts(mastery.getCorrectAttempts() + 1);
        }
        mastery.setLastPracticedAt(LocalDateTime.now());

        return masteryRepository.save(mastery);
    }

    public List<StudentTopicMastery> getAllMasteryForStudent(Long studentId) {
        return masteryRepository.findByStudentId(studentId);
    }

    // Powers "Weakness Detection" - topics below a given mastery threshold
    public List<StudentTopicMastery> getWeakTopics(Long studentId, double threshold) {
        return masteryRepository.findByStudentIdAndMasteryScoreLessThan(studentId, threshold);
    }

    public double getForgettingRisk(Long studentId, Long topicId) {
        StudentTopicMastery mastery = getOrCreateMastery(studentId, topicId);
        return ForgettingRiskCalculator.calculateForgettingRisk(
                mastery.getMasteryScore(), mastery.getLastPracticedAt());
    }
}