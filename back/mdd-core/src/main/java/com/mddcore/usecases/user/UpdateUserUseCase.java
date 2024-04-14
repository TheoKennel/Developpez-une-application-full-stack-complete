package com.mddcore.usecases.user;

import com.mddcore.domain.models.User;
import com.mddcore.domain.repository.IUserRepository;
import com.mddcore.usecases.UseCase;

import java.util.Optional;
import java.util.logging.Logger;

/**
 * Use case for updating user information.
 */
public class UpdateUserUseCase extends UseCase<UpdateUserUseCase.InputValues, UpdateUserUseCase.OutputValues> {
    private final IUserRepository userRepository;

    public UpdateUserUseCase(IUserRepository userRepository) {
        this.userRepository = userRepository;
    }

   /**
     * Updates user information.
     * @param input the input values containing the user ID, updated user data, and authentication ID
     * @return the output values containing the updated user
     * @throws IllegalArgumentException if the user to update is not found or authentication fails
     */
    @Override
    public OutputValues execute(InputValues input) {
        existByEmail(input.user, input.id);
        return userRepository.findById(input.id()).map(user -> {
            if (!user.getId().equals(input.authId)) {
                throw new IllegalArgumentException("Authenticate user don't match user to update");
            } else {
                return persistAndReturn(user, input);
            }
        }).orElseThrow(() -> new IllegalArgumentException("User to update not found"));
    }

    private OutputValues persistAndReturn(User user, InputValues input) {
        if (!input.user.getEmail().equals(user.getEmail())) {
            user.setEmail(input.user.getEmail());
        }

        if (!input.user.getUsername().equals(user.getUsername())) {
            user.setUsername(input.user.getUsername());
        }

        return new OutputValues(userRepository.save(user));
    }

    private void existByEmail(User user, Long id) {
        Optional<User> existingUserByEmail = userRepository.findByEmail(user.getEmail());
        Logger logger = Logger.getLogger(UpdateUserUseCase.class.getName());

        if (existingUserByEmail.isPresent()) {
            User foundUser = existingUserByEmail.get();
            logger.info("Found user ID: " + foundUser.getId());

            if (!foundUser.getId().equals(id)) {
                throw new IllegalArgumentException("Email is already in use.");
            }
        } else {
            logger.info("No user found with email: " + user.getEmail());
        }
    }

    public record InputValues(Long id, User user, Long authId) implements UseCase.InputValues {
    }

    public record OutputValues(User user) implements UseCase.OutputValues {
    }
}
