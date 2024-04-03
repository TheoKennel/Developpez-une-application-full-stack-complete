package com.mddinfrastructure.response;

import com.mddcore.domain.models.Subscription;

import java.util.List;
import java.util.stream.Collectors;

public record SubscriptionResponse(
        Long id,
        SubjectResponse subject
) {

    public static SubscriptionResponse from(Subscription subscription) {
        SubjectResponse subjectResponse = SubjectResponse.from(subscription.getSubject());
        return new SubscriptionResponse(
                subscription.getId(),
                subjectResponse
        );
    }

    public static List<SubscriptionResponse> from(List<Subscription> subscriptionList) {
        return subscriptionList.stream()
                .map(SubscriptionResponse::from)
                .collect(Collectors.toList());
    }
}
