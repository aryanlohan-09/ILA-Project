package com.bruteforce.ila.syllabus;

import com.bruteforce.ila.syllabus.dto.TopicRequest;
import com.bruteforce.ila.syllabus.dto.TopicResponse;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/topics")
public class TopicController {

    private final TopicService topicService;

    public TopicController(TopicService topicService) {
        this.topicService = topicService;
    }

    @PostMapping
    public ResponseEntity<TopicResponse> createTopic(@Valid @RequestBody TopicRequest request) {
        Topic topic = topicService.createTopic(
                request.getName(), request.getDescription(),
                request.getDifficultyLevel(), request.getUnitId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(topic));
    }

    @GetMapping("/by-unit/{unitId}")
    public ResponseEntity<List<TopicResponse>> getTopicsByUnit(@PathVariable Long unitId) {
        List<TopicResponse> topics = topicService.getTopicsByUnit(unitId)
                .stream().map(this::toResponse).toList();
        return ResponseEntity.ok(topics);
    }

    @GetMapping
    public ResponseEntity<List<TopicResponse>> getAllTopics() {
        List<TopicResponse> topics = topicService.getAllTopics()
                .stream().map(this::toResponse).toList();
        return ResponseEntity.ok(topics);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TopicResponse> getTopicById(@PathVariable Long id) {
        return ResponseEntity.ok(toResponse(topicService.getTopicById(id)));
    }

    private TopicResponse toResponse(Topic topic) {
        return new TopicResponse(
                topic.getId(), topic.getName(), topic.getDescription(), topic.getDifficultyLevel(),
                topic.getUnit().getId(), topic.getUnit().getName());
    }
}