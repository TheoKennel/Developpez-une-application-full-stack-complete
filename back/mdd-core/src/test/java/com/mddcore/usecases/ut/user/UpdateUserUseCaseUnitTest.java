package com.mddcore.usecases.ut.user;

import com.mddcore.domain.models.User;
import com.mddcore.domain.repository.IUserRepository;
import com.mddcore.usecases.auth.IPasswordEncodeFinal;
import com.mddcore.usecases.user.UpdateUserUseCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UpdateUserUseCaseUnitTest {
    @InjectMocks
    private UpdateUserUseCase useCase;
    @Mock
    private IUserRepository repository;
    @Mock
    private IPasswordEncodeFinal passwordEncoder;

    @Test
    public void UpdateUserUseCase_ShouldReturnSignInRequest_WithValidUserInput() {
        User user = new User();
        user.setEmail("test@unit.com");
        user.setUsername("theo");
        user.setId(1L);
        UpdateUserUseCase.InputValues inputValues = new UpdateUserUseCase.InputValues(1L, user, 1L);

        doReturn(Optional.of(user)).when(repository).findById(1L);
        doReturn(user).when(repository).save(user);

        UpdateUserUseCase.OutputValues outputValues = useCase.execute(inputValues);

        assertThat(outputValues.user().getEmail()).isEqualTo(user.getEmail());
        verify(repository, times(1)).save(user);
        verify(repository, times(1)).findById(1L);
    }


    @Test
    public void UpdateUserUseCase_ShouldThrowError_WhenUserEmailExist() {
        User user = new User();
        user.setId(2L);
        UpdateUserUseCase.InputValues inputValues = new UpdateUserUseCase.InputValues(2L, user, 1L);

        doReturn(Optional.of(user)).when(repository).findById(2L);

        assertThatThrownBy(() -> useCase.execute(inputValues))
                .isInstanceOf(IllegalArgumentException.class)
                        .hasMessageContaining("Authenticate user don't match user to update");
        verify(repository, never()).save(user);
        verify(repository, times(1)).findById(2L);
    }

    @Test
    public void UpdateUserUseCase_ShouldThrowError_WhenUserDoNotExist() {
        User user = new User();
        UpdateUserUseCase.InputValues inputValues = new UpdateUserUseCase.InputValues(2L, user, 1L);

        doThrow(new IllegalArgumentException("User to update not found")).when(repository).findById(2L);

        assertThatThrownBy(() -> useCase.execute(inputValues))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("User to update not found");
        verify(repository, never()).save(user);
        verify(repository, times(1)).findById(2L);
    }
}
