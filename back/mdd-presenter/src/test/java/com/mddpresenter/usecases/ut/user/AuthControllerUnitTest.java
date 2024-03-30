package com.mddpresenter.usecases.ut.user;

import com.mddcore.usecases.UseCaseExecutor;
import com.mddcore.usecases.auth.SignInRequest;
import com.mddcore.usecases.user.RegisterUseCase;
import com.mddinfrastructure.request.UserSettingRequest;
import com.mddinfrastructure.security.jwt.CookieJwt;
import com.mddinfrastructure.security.jwt.JwtService;
import com.mddinfrastructure.security.jwt.JwtTokenProvider;
import com.mddinfrastructure.security.usecases.AuthenticateUserUseCase;
import com.mddinfrastructure.security.userdetails.CustomUserDetails;
import com.mddinfrastructure.user.AuthController;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import javax.servlet.http.HttpServletRequest;
import java.util.concurrent.CompletableFuture;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doReturn;
import static org.mockito.Mockito.mock;

@ExtendWith(MockitoExtension.class)
public class AuthControllerUnitTest {
    @InjectMocks
    private AuthController authController;
    @Mock
    private UseCaseExecutor useCaseExecutor;
    @Mock
    private CookieJwt cookieJwt;
    @Mock
    private JwtService jwtService;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    private String email = "email@test.com";
    private String password = "123456789&";

    @Test
    public void RegisterUser_ShouldReturnCompletableSignInRequest() {
        UserSettingRequest userSettingRequest = new UserSettingRequest(email, password, "theo");
        SignInRequest expectedSignInRequest = new SignInRequest("theo@test.com", "1234561aze&qsdD" );

        doReturn(CompletableFuture.completedFuture(expectedSignInRequest))
                .when(useCaseExecutor)
                .execute(any(), any(RegisterUseCase.InputValues.class), any());

        CompletableFuture<SignInRequest> resultFuture = authController.registerUser(userSettingRequest);
        SignInRequest result = resultFuture.join();

        assertThat(result.password()).isEqualTo(expectedSignInRequest.password());
        assertThat(result.email()).isEqualTo(expectedSignInRequest.email());
    }

    @Test
    public void LoginUser_ShouldReturnAuthResponse() {
        CustomUserDetails customUserDetails = mock(CustomUserDetails.class);
        SignInRequest signInRequest = new SignInRequest("theo@test.com", "1234561aze&qsdD" );
        ResponseCookie jwtCookie = ResponseCookie.from("jwt", "jwtCookieValue").build();

        AuthenticateUserUseCase.OutputValues outputValues = new AuthenticateUserUseCase.OutputValues(jwtCookie, customUserDetails);
        ResponseEntity<?> expectedResponseEntity = ResponseEntity.ok("ExpectedResponse");

        doReturn(CompletableFuture.completedFuture(outputValues))
                .when(useCaseExecutor)
                .execute(any(), any(AuthenticateUserUseCase.InputValues.class), any());

        doReturn(CompletableFuture.completedFuture(expectedResponseEntity))
                .when(jwtService)
                .generateAuthResponse(any(CustomUserDetails.class));

        CompletableFuture<?> resultFuture = authController.loginUser(signInRequest);

        assertThat(resultFuture.join()).isEqualTo(expectedResponseEntity);
    }

    @Test
    public void LogoutUser_shouldGenerateLogoutResponse() {
        ResponseEntity<?> expectedResponse = ResponseEntity.ok("Expected response");

        doReturn(CompletableFuture.completedFuture(expectedResponse))
                .when(jwtService).generateLogoutResponse(1L);
        doReturn(1L).when(jwtTokenProvider).getAuthenticateUser();

        CompletableFuture<?> result = authController.logoutUser();

        assertThat(result.join()).isEqualTo(expectedResponse);
    }

    @Test
    public void RefreshToken_ShouldGenerateNewToken() {
        ResponseEntity<?> response = ResponseEntity.ok("Expected Response");
        HttpServletRequest request = mock(HttpServletRequest.class);

        doReturn("token").when(cookieJwt).getJwtRefreshFromCookies(request);
        doReturn(CompletableFuture.completedFuture(response)).when(jwtService).generateRefreshTokenResponse("token");

        CompletableFuture<?> result = authController.refreshToken(request);

        assertThat(result.join()).isEqualTo(response);
    }
}
