package com.bruteforce.ila.subject;

import com.bruteforce.ila.subject.dto.SubjectRequest;
import com.bruteforce.ila.subject.dto.SubjectResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @PostMapping
    public ResponseEntity<SubjectResponse> createSubject(@Valid @RequestBody SubjectRequest request) {
        Subject subject = subjectService.createSubject(request.getName(), request.getDescription());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(subject));
    }

    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        List<SubjectResponse> subjects = subjectService.getAllSubjects()
                .stream()
                .map(this::toResponse)
                .toList();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long id) {
        Subject subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(toResponse(subject));
    }

    private SubjectResponse toResponse(Subject subject) {
        return new SubjectResponse(
                subject.getId(),
                subject.getName(),
                subject.getDescription(),
                subject.getCreatedAt(),
                subject.getUpdatedAt()
        );
    }
}