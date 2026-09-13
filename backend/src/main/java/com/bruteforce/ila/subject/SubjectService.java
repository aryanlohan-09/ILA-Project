package com.bruteforce.ila.subject;

import com.bruteforce.ila.common.exception.DuplicateResourceException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    public Subject createSubject(String name, String description) {
        if (subjectRepository.existsByName(name)) {
            throw new DuplicateResourceException("Subject with name '" + name + "' already exists.");
        }
        Subject subject = new Subject(name, description);
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public Subject getSubjectById(Long id) {
        return subjectRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Subject with id " + id + " not found."));
    }
}