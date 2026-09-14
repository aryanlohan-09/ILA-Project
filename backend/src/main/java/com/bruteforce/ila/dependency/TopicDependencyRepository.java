package com.bruteforce.ila.dependency;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TopicDependencyRepository extends JpaRepository<TopicDependency, Long> {

    // All prerequisites required BY this topic
    List<TopicDependency> findByTopicId(Long topicId);

    // All topics that require THIS topic as a prerequisite
    // (this is what tells us "Prerequisite Impact" - how many topics depend on this one)
    List<TopicDependency> findByPrerequisiteTopicId(Long prerequisiteTopicId);

    boolean existsByTopicIdAndPrerequisiteTopicId(Long topicId, Long prerequisiteTopicId);
}