package com.mddinfrastructure.subscription;

import com.mddcore.usecases.UseCaseExecutor;
import com.mddcore.usecases.subscription.AddSubscriptionUseCase;
import com.mddcore.usecases.subscription.RemoveSubscriptionUseCase;
import com.mddinfrastructure.response.ApiResponse;
import com.mddinfrastructure.response.SubscriptionResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.concurrent.CompletableFuture;

@Component
public class SubscriptionController implements SubscriptionResource {

    private final AddSubscriptionUseCase addSubscriptionUseCase;
    private final RemoveSubscriptionUseCase removeSubscriptionUseCase;
    private final UseCaseExecutor useCaseExecutor;

    public SubscriptionController(AddSubscriptionUseCase addSubscriptionUseCase,
                                  RemoveSubscriptionUseCase removeSubscriptionUseCase, UseCaseExecutor useCaseExecutor) {
        this.addSubscriptionUseCase = addSubscriptionUseCase;
        this.removeSubscriptionUseCase = removeSubscriptionUseCase;
        this.useCaseExecutor = useCaseExecutor;
    }

    /**
     * Saves a subscription asynchronously.
     *
     * @param userId    The ID of the user to subscribe.
     * @param subjectId The ID of the subject to subscribe to.
     * @return A CompletableFuture containing an ApiResponse indicating the success or failure of the operation.
     */
    @Override
    public CompletableFuture<SubscriptionResponse> saveSubscription(@PathVariable Long userId, @PathVariable Long subjectId) {
        return useCaseExecutor.execute(addSubscriptionUseCase,
                new AddSubscriptionUseCase.InputValues(userId, subjectId),
                outputValues ->  SubscriptionResponse.from(outputValues.subscription()));
    }

    /**
     * Removes a subscription asynchronously.
     *
     * @param subscriptionId The ID of the subscription to remove.
     * @return A CompletableFuture containing an ApiResponse indicating the success or failure of the operation.
     */
    @Override
    public CompletableFuture<ApiResponse> removeSubscription(@PathVariable Long subscriptionId) {
        return useCaseExecutor.execute(removeSubscriptionUseCase,
                new RemoveSubscriptionUseCase.InputValues(subscriptionId),
                outputValues -> new ApiResponse(outputValues.success(), "Subscription removed with success"));
    }
}
