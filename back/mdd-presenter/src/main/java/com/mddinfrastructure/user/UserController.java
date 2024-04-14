package com.mddinfrastructure.user;

import com.mddcore.usecases.UseCaseExecutor;
import com.mddcore.usecases.user.DeleteUserUseCase;
import com.mddcore.usecases.user.GetUserUseCase;
import com.mddcore.usecases.user.UpdateUserUseCase;
import com.mddinfrastructure.mapper.UserUpdateMapper;
import com.mddinfrastructure.request.UserUpdateRequest;
import com.mddinfrastructure.response.ApiResponse;
import com.mddinfrastructure.response.UserResponse;
import com.mddinfrastructure.security.jwt.JwtTokenProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.concurrent.CompletableFuture;

@Component
public class  UserController implements UserResource {

    private final UseCaseExecutor useCaseExecutor;
    private final GetUserUseCase getUserUseCase;
    private final DeleteUserUseCase deleteUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final JwtTokenProvider jwtTokenProvider;

    public UserController(UseCaseExecutor useCaseExecutor, GetUserUseCase getUserUseCase,
                          DeleteUserUseCase deleteUserUseCase, UpdateUserUseCase updateUserUseCase, JwtTokenProvider jwtTokenProvider) {
        this.useCaseExecutor = useCaseExecutor;
        this.getUserUseCase = getUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Retrieves a user by ID asynchronously.
     *
     * @param id The ID of the user to retrieve.
     * @return A CompletableFuture containing the UserResponse for the retrieved user.
     */
    @Override
    public CompletableFuture<UserResponse> getUserById(@PathVariable Long id) {
        return useCaseExecutor.execute(
                getUserUseCase,
                new GetUserUseCase.InputValues(id),
                (outputValues) -> UserResponse.from(outputValues.user()));
    }

    /**
     * Deletes a user by ID asynchronously.
     *
     * @param id The ID of the user to delete.
     * @return A CompletableFuture containing a ResponseEntity indicating the success or failure of the operation.
     */
    @Override
    public CompletableFuture<ApiResponse> deleteUserById(@PathVariable Long id) {
        Long authId = jwtTokenProvider.getAuthenticateUser();
        return useCaseExecutor.execute(
                deleteUserUseCase,
                new DeleteUserUseCase.InputValues(id, authId),
                outputValues -> new ApiResponse(outputValues.isDeleted(), "Delete user successfully")
        );
    }

    /**
     * Updates a user asynchronously.
     *
     * @param id                The ID of the user to update.
     * @param userUpdateRequest The UserSettingRequest containing the updated user details.
     * @return A CompletableFuture containing the updated UserResponse.
     */
    @Override
    public CompletableFuture<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest userUpdateRequest) {
        Long authId = jwtTokenProvider.getAuthenticateUser();
        return useCaseExecutor.execute(
                updateUserUseCase,
                new UpdateUserUseCase.InputValues(id, UserUpdateMapper.INSTANCE.toDomain(userUpdateRequest), authId),
                outputValues -> UserResponse.from(outputValues.user()));
    }

    /**
     * Retrieves the authenticated user ID asynchronously.
     *
     * @return A CompletableFuture containing a ResponseEntity with the authenticated user ID.
     */

    @Override
    public CompletableFuture<ResponseEntity<?>> getUserAuth() {
        Long authId =  jwtTokenProvider.getAuthenticateUser();
        ResponseEntity<Long> responseEntity = ResponseEntity.ok(authId);
        return CompletableFuture.completedFuture(responseEntity);
    }
}
