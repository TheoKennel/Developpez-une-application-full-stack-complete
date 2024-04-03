package com.mdddetails.repository.subscription;

import com.mddcore.domain.models.Subscription;
import com.mddcore.domain.repository.ISubscriptionRepository;
import com.mdddetails.mapper.SubscriptionMapper;
import com.mdddetails.models.SubscriptionEntity;
import org.springframework.stereotype.Repository;

/**
 * Manages subscription data operations.
 */
@Repository
public class SubscriptionRepoImpl implements ISubscriptionRepository {

    private final SubscriptionJpaRepo repo;
    private final SubscriptionMapper mapper;


    public SubscriptionRepoImpl(SubscriptionJpaRepo repo, SubscriptionMapper mapper) {
        this.repo = repo;
        this.mapper = mapper;
    }

    /**
     * Saves a subscription, converting it to an entity before persisting.
     * @param subscription the subscription to save
     */
    @Override
    public Subscription save(Subscription subscription) {
        SubscriptionEntity subscriptionEntity = mapper.toEntity(subscription);
        subscriptionEntity =  repo.save(subscriptionEntity);
        return mapper.toDomain(subscriptionEntity);

    }

    /**
     * Deletes a subscription by its ID.
     * @param id the ID of the subscription to delete
     */
    @Override
    public void deleteById(Long id) {
        repo.deleteById(id);
    }
}
