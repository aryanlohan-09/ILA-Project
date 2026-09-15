package com.bruteforce.ila.quiz;

import com.bruteforce.ila.quiz.dto.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    @PostMapping("/questions")
    public ResponseEntity<QuestionResponse> createQuestion(@Valid @RequestBody QuestionRequest request) {
        Question question = quizService.createQuestion(
                request.getQuestionText(), request.getOptionA(), request.getOptionB(),
                request.getOptionC(), request.getOptionD(), request.getCorrectOption(),
                request.getDifficultyLevel(), request.getTopicId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toQuestionResponse(question));
    }

    @GetMapping("/questions/by-topic/{topicId}")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByTopic(@PathVariable Long topicId) {
        List<QuestionResponse> result = quizService.getQuestionsByTopic(topicId)
                .stream().map(this::toQuestionResponse).toList();
        return ResponseEntity.ok(result);
    }

    @PostMapping("/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(@Valid @RequestBody SubmitQuizRequest request) {
        QuizAttempt attempt = quizService.submitQuiz(request.getStudentId(), request.getAnswers());
        double scorePercentage = (attempt.getCorrectAnswers() * 100.0) / attempt.getTotalQuestions();
        QuizResultResponse response = new QuizResultResponse(
                attempt.getId(), attempt.getTotalQuestions(), attempt.getCorrectAnswers(),
                scorePercentage, attempt.getSubmittedAt());
        return ResponseEntity.ok(response);
    }

    private QuestionResponse toQuestionResponse(Question q) {
        return new QuestionResponse(
                q.getId(), q.getQuestionText(), q.getOptionA(), q.getOptionB(),
                q.getOptionC(), q.getOptionD(), q.getDifficultyLevel(),
                q.getTopic().getId(), q.getTopic().getName());
    }
}