package com.bruteforce.ila.dependency;

import com.bruteforce.ila.common.exception.DuplicateResourceException;
import com.bruteforce.ila.syllabus.Topic;
import com.bruteforce.ila.syllabus.TopicRepository;
import java.util.List;
import java.util.NoSuchElementException;
import org.springframework.stereotype.Service;

@Service
public class TopicDependencyService {

    private final TopicDependencyRepository dependencyRepository;
    private final TopicRepository topicRepository;

    public TopicDependencyService(TopicDependencyRepository dependencyRepository,
                                  TopicRepository topicRepository) {
        this.dependencyRepository = dependencyRepository;
        this.topicRepository = topicRepository;
    }

    public TopicDependency createDependency(Long topicId, Long prerequisiteTopicId) {
        if (topicId.equals(prerequisiteTopicId)) {
            throw new IllegalArgumentException("A topic cannot depend on itself.");
        }

        Topic topic = topicRepository.findById(topicId)
                .orElseThrow(() -> new NoSuchElementException("Topic with id " + topicId + " not found."));
        Topic prerequisite = topicRepository.findById(prerequisiteTopicId)
                .orElseThrow(() -> new NoSuchElementException(
                        "Prerequisite topic with id " + prerequisiteTopicId + " not found."));

        if (dependencyRepository.existsByTopicIdAndPrerequisiteTopicId(topicId, prerequisiteTopicId)) {
            throw new DuplicateResourceException("This dependency already exists.");
        }

        TopicDependency dependency = new TopicDependency(topic, prerequisite);
        return dependencyRepository.save(dependency);
    }

    // All prerequisites a topic requires before it can be studied
    public List<TopicDependency> getPrerequisitesOf(Long topicId) {
        return dependencyRepository.findByTopicId(topicId);
    }

    // All topics that require this topic as a prerequisite
    // The SIZE of this list is exactly the "Prerequisite Impact" score input
    public List<TopicDependency> getTopicsThatDependOn(Long topicId) {
        return dependencyRepository.findByPrerequisiteTopicId(topicId);
    }
}