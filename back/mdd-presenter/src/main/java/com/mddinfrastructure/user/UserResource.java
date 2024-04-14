package com.mddinfrastructure.user;

import com.mddinfrastructure.request.UserUpdateRequest;
import com.mddinfrastructure.response.ApiResponse;
import com.mddinfrastructure.response.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/user")
public interface UserResource {
    @GetMapping("/{id}")
    CompletableFuture<UserResponse> getUserById(@PathVariable Long id);

    @DeleteMapping("/{id}")
    CompletableFuture<ApiResponse> deleteUserById(@PathVariable Long id);

    @PutMapping("/{id}")
    CompletableFuture<UserResponse> updateUser(@PathVariable Long id, @RequestBody UserUpdateRequest userUpdateRequest);

    @GetMapping()
    CompletableFuture<ResponseEntity<?>> getUserAuth();
}
