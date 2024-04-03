package com.mddcore.domain.repository;

import com.mddcore.domain.models.Subscription;

public interface ISubscriptionRepository {
    Subscription save(Subscription subscription);
    void deleteById(Long id);
}
