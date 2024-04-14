package com.mddpresenter.usecases.ut.user;

import com.mddcore.domain.models.User;
import com.mddcore.usecases.UseCaseExecutor;
import com.mddcore.usecases.user.DeleteUserUseCase;
import com.mddcore.usecases.user.GetUserUseCase;
import com.mddcore.usecases.user.UpdateUserUseCase;
import com.mddinfrastructure.request.UserUpdateRequest;
import com.mddinfrastructure.response.ApiResponse;
import com.mddinfrastructure.response.SubscriptionResponse;
import com.mddinfrastructure.response.UserResponse;
import com.mddinfrastructure.security.jwt.JwtTokenProvider;
import com.mddinfrastructure.user.UserController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class UserControllerUnitTest {
    @InjectMocks
    private UserController userController;
    @Mock
    private UseCaseExecutor useCaseExecutor;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private DeleteUserUseCase deleteUserUseCase;
    @Mock
    private UpdateUserUseCase updateUserUseCase;

    @Test
    public void GetUserById_ShouldReturnUserResponse() {
        List<SubscriptionResponse> subscriptionList = new ArrayList<>();
        UserResponse userResponse = new UserResponse("test@gmail.com", "theo", subscriptionList);

        doReturn(CompletableFuture.completedFuture(userResponse)).when(useCaseExecutor)
                .execute(any(),
                        any(GetUserUseCase.InputValues.class),
                        any());

        CompletableFuture<UserResponse> result = userController.getUserById(1L);

        assertThat(result.join().email()).isEqualTo(userResponse.email());
    }

    @Test
    public void DeleteUserById_ShouldReturnTrueInApiResponse() {
        Long id = 1L;
        ApiResponse apiResponse = new ApiResponse(true,"Delete user successfully");

        doReturn(1L).when(jwtTokenProvider).getAuthenticateUser();
        doReturn(CompletableFuture.completedFuture(apiResponse))
                .when(useCaseExecutor)
                .execute(eq(deleteUserUseCase), any(DeleteUserUseCase.InputValues.class), any());

        CompletableFuture<ApiResponse> result = userController.deleteUserById(id);
        ApiResponse response = result.join();

        assertThat(response.message()).isEqualTo(apiResponse.message());
        assertTrue(response.success());
    }

    @Test
    public void updateUser_ShouldReturnExpectedUserResponse() {
        Long id = 1L;
        UserUpdateRequest userUpdateRequest = new UserUpdateRequest("theo", "email@email.com");

        User user = new User();
        UserResponse expectedResponse = UserResponse.from(user);

        doReturn(CompletableFuture.completedFuture(expectedResponse))
                .when(useCaseExecutor)
                .execute(eq(updateUserUseCase), any(UpdateUserUseCase.InputValues.class), any());

        CompletableFuture<UserResponse> result = userController.updateUser(id, userUpdateRequest);
        UserResponse response = result.join();

        assertThat(response).isEqualTo(expectedResponse);
    }

    @Test
    public void getUserAuth_ShouldReturnAuthId() {
        Long expectedAuthId = 2L;

        doReturn(2L).when(jwtTokenProvider).getAuthenticateUser();

        CompletableFuture<ResponseEntity<?>> result = userController.getUserAuth();
        ResponseEntity<?> response = result.join();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expectedAuthId);
    }
}
