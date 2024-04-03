package com.mddcore.usecases.subscription;

import com.mddcore.domain.models.Subject;
import com.mddcore.domain.models.Subscription;
import com.mddcore.domain.models.User;
import com.mddcore.domain.repository.ISubjectRepository;
import com.mddcore.domain.repository.ISubscriptionRepository;
import com.mddcore.domain.repository.IUserRepository;
import com.mddcore.usecases.UseCase;

/**
 * Use case for adding a subscription to a subject for a user.
 */
public class AddSubscriptionUseCase extends UseCase<AddSubscriptionUseCase.InputValues, AddSubscriptionUseCase.OutputValues> {

    private final ISubscriptionRepository repository;
    private final IUserRepository userRepository;
    private final ISubjectRepository subjectRepository;

    /**
     * Adds a subscription for a user to a subject. Validates that the user and subject exist
     * and checks that the user is not already subscribed to the subject before adding the subscription.
     * @return the output values indicating whether the subscription was added successfully
     * @throws IllegalArgumentException if the user or subject does not exist
     * @throws IllegalStateException if the user is already subscribed to the subject
     */
    public AddSubscriptionUseCase(ISubscriptionRepository repository, IUserRepository userRepository, ISubjectRepository subjectRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    @Override
    public OutputValues execute(InputValues input) {
            User user = userRepository.findById(input.userId())
                    .orElseThrow(() -> new IllegalArgumentException("User cannot be null"));

            Subject subject = subjectRepository.findById(input.subjectId())
                    .orElseThrow(() -> new IllegalArgumentException("Subject cannot be null"));


            if (isAlreadySubscribed(user, input.subjectId())) {
                throw new IllegalStateException("Already subscribed to this subject");
            }

            Subscription subscription = new Subscription(
                    null,
                    subject,
                    input.userId()
            );

            Subscription subscriptionAdded = repository.save(subscription);

            return new OutputValues(true, subscriptionAdded);
    }

    private Boolean isAlreadySubscribed(User user, Long subjectId) {
        return user.getSubscriptionList().stream().anyMatch(listSubscriptionId -> listSubscriptionId.getSubject().getId().equals(subjectId));
    }

    public record InputValues(Long userId, Long subjectId) implements UseCase.InputValues {}

    public record OutputValues(Boolean isAdded, Subscription subscription) implements UseCase.OutputValues {}
}
