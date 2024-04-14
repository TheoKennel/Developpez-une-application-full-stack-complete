package com.mddpresenter.usecases.ut.subscription;

import com.mddcore.usecases.UseCaseExecutor;
import com.mddcore.usecases.subscription.AddSubscriptionUseCase;
import com.mddcore.usecases.subscription.RemoveSubscriptionUseCase;
import com.mddinfrastructure.response.ApiResponse;
import com.mddinfrastructure.response.SubjectResponse;
import com.mddinfrastructure.response.SubscriptionResponse;
import com.mddinfrastructure.subscription.SubscriptionController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class SubscriptionControllerUnitTest {
    @InjectMocks
    private SubscriptionController subscriptionController;
    @Mock
    private UseCaseExecutor useCaseExecutor;
    @Mock
    private AddSubscriptionUseCase addSubscriptionUseCase;
    @Mock
    private RemoveSubscriptionUseCase removeSubscriptionUseCase;

    Long userId = 1L;
    Long subjectId = 1L;

    @Test
    public void RemoveSubscription_ShouldReturnTrueInApiResponse_WhenSuccess() {
        ApiResponse apiResponse = new ApiResponse(
                true,
                "Subscription removed with success"
        );

        doReturn(CompletableFuture.completedFuture(apiResponse)).when(useCaseExecutor).execute(
                eq(removeSubscriptionUseCase),
                any(RemoveSubscriptionUseCase.InputValues.class),
                any()
        );

        CompletableFuture<ApiResponse> result = subscriptionController.removeSubscription(1L);
        ApiResponse response = result.join();

        assertThat(response.success()).isTrue();
        assertThat(response.message()).isEqualTo(apiResponse.message());
    }

    @Test
    public void RemoveSubscription_ShouldReturnFalseInApiResponse_WhenNotSuccess() {
        ApiResponse apiResponse = new ApiResponse(
                false,
                "Error occurred while removing subscription"
        );

        doReturn(CompletableFuture.completedFuture(apiResponse)).when(useCaseExecutor).execute(
                eq(removeSubscriptionUseCase),
                any(RemoveSubscriptionUseCase.InputValues.class),
                any()
        );

        CompletableFuture<ApiResponse> result = subscriptionController.removeSubscription(1L);
        ApiResponse response = result.join();

        assertThat(response.success()).isFalse();
        assertThat(response.message()).isEqualTo(apiResponse.message());
    }

    @Test
    public void saveSubscription_ShouldReturnSuccessResponse() {
        SubjectResponse subjectResponse = mock(SubjectResponse.class);
        SubscriptionResponse subscriptionResponse = new SubscriptionResponse(2L, subjectResponse);

        doReturn(CompletableFuture.completedFuture(subscriptionResponse))
                .when(useCaseExecutor)
                .execute(eq(addSubscriptionUseCase), any(AddSubscriptionUseCase.InputValues.class), any());

        CompletableFuture<SubscriptionResponse> result = subscriptionController.saveSubscription(userId, subjectId);
        SubscriptionResponse response = result.join();

        assertThat(response).isEqualTo(subscriptionResponse);
    }
}
