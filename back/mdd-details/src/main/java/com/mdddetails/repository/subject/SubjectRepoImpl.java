package com.mdddetails.repository.subject;

import com.mddcore.domain.models.Subject;
import com.mddcore.domain.repository.ISubjectRepository;
import com.mdddetails.mapper.SubjectMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Handles operations for subject data.
 */
@Repository
public class SubjectRepoImpl implements ISubjectRepository {
    private final SubjectJpaRepo jpaRepo;
    private final SubjectMapper subjectMapper;

    public SubjectRepoImpl(SubjectJpaRepo jpaRepo, SubjectMapper subjectMapper) {
        this.jpaRepo = jpaRepo;
        this.subjectMapper = subjectMapper;
    }


    /**
     * Fetches all subjects, converting them to the domain model.
     * @return a list of {@link Subject}
     */
    @Override
    @Transactional
    public List<Subject> findAll() {
        return jpaRepo.findAll().stream().map(subjectMapper::toDomain).collect(Collectors.toList());
    }

    /**
     * Finds a subject by its ID.
     * @param id the ID of the subject to find
     * @return an {@link Optional} containing the subject if found
     */
    @Override
    @Transactional
    public Optional<Subject> findById(Long id) {
        return jpaRepo.findById(id).map(subjectMapper::toDomain);
    }
}
