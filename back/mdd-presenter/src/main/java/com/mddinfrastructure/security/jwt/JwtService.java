package com.mddinfrastructure.security.jwt;

import com.mddcore.domain.models.RefreshToken;
import com.mddcore.usecases.UseCaseExecutor;
import com.mddcore.usecases.user.token.*;
import com.mddinfrastructure.response.AuthResponse;
import com.mddinfrastructure.security.userdetails.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

/**
 * Service class for JWT-related operations.
 */
@Service
public class JwtService {
    private final CookieJwt cookieJwt;
    private final CreateRefreshTokenUseCase createRefreshTokenUseCase;
    private final UseCaseExecutor useCaseExecutor;
    private final FindByTokenUseCase findByTokenUseCase;
    private final VerifyTokenExpirationUseCase verifyTokenExpirationUseCase;
    private final UpdateRefreshTokenUseCase updateRefreshTokenUseCase;
    private final DeleteRefreshTokenUseCase deleteRefreshTokenUseCase;

    @Value("${mdd.app.jwtRefreshExpirationsMs}")
    private Long refreshTokenExpirationMs;

    public JwtService(CookieJwt cookieJwt, CreateRefreshTokenUseCase createRefreshTokenUseCase, UseCaseExecutor useCaseExecutor, FindByTokenUseCase findByTokenUseCase, VerifyTokenExpirationUseCase verifyTokenExpirationUseCase,
                      UpdateRefreshTokenUseCase updateRefreshTokenUseCase, DeleteRefreshTokenUseCase deleteRefreshTokenUseCase) {
        this.cookieJwt = cookieJwt;
        this.createRefreshTokenUseCase = createRefreshTokenUseCase;
        this.useCaseExecutor = useCaseExecutor;
        this.findByTokenUseCase = findByTokenUseCase;
        this.verifyTokenExpirationUseCase = verifyTokenExpirationUseCase;
        this.updateRefreshTokenUseCase = updateRefreshTokenUseCase;
        this.deleteRefreshTokenUseCase = deleteRefreshTokenUseCase;
    }

    /**
     * Generates an authentication response containing JWT cookies.
     *
     * @param userDetails The UserDetails object containing user details.
     * @return A CompletableFuture containing the ResponseEntity with the authentication response.
     */
    public CompletableFuture<ResponseEntity<?>> generateAuthResponse(CustomUserDetails userDetails) {
        return useCaseExecutor.execute(
                createRefreshTokenUseCase,
                new CreateRefreshTokenUseCase.InputValues(userDetails.getUser().getId(), refreshTokenExpirationMs),
                outputValues -> {
                    ResponseCookie cookie = cookieJwt.generateJwtCookie(userDetails);
                    ResponseCookie jwtRefresh = cookieJwt.generateRefreshJwtCookie(outputValues.token());

                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, cookie.toString())
                            .header(HttpHeaders.SET_COOKIE, jwtRefresh.toString())
                            .body(new AuthResponse(userDetails.getId(), userDetails.getPictureUrl(), userDetails.getUserName()));
                }
        );
    }

    /**
     * Generates a logout response by deleting JWT cookies.
     *
     * @return A CompletableFuture containing the ResponseEntity with the logout response.
     */
    public CompletableFuture<ResponseEntity<?>> generateLogoutResponse(Long authId) {
        return useCaseExecutor.execute(
                deleteRefreshTokenUseCase,
                new DeleteRefreshTokenUseCase.InputValues(authId),
                output -> {
                    ResponseCookie jwtCookie = cookieJwt.getCleanJwtCookie();
                    ResponseCookie jwtRefreshCookie = cookieJwt.getCleanJwtRefreshCookie();

                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                            .header(HttpHeaders.SET_COOKIE, jwtRefreshCookie.toString())
                            .body("You've been signed out successfully!");
                }
        );
    }

    /**
     * Generates a response for refreshing the JWT token.
     *
     * @param token The refresh token.
     * @return A CompletableFuture containing the ResponseEntity with the refresh token response.
     */
    public CompletableFuture<ResponseEntity<?>> generateRefreshTokenResponse(String token) {
        if ((token == null) || (token.isEmpty())) {
            return CompletableFuture.completedFuture(ResponseEntity.badRequest().body("Refresh token is empty"));
        }

        return getRefreshToken(token)
                .thenCompose(this::verifyTokenNotExpire)
                .thenCompose(this::updateRefreshToken)
                .thenApply(validToken -> {
                    ResponseCookie cookie = cookieJwt.generateJwtCookie(validToken.getUser());
                    ResponseCookie jwtRefresh = cookieJwt.generateRefreshJwtCookie(validToken.getToken());
                    return ResponseEntity.ok()
                            .header(HttpHeaders.SET_COOKIE, cookie.toString())
                            .header(HttpHeaders.SET_COOKIE, jwtRefresh.toString())
                            .body("Token is refreshed successfully!");
                });
    }

    private CompletableFuture<RefreshToken> getRefreshToken(String token) {
        return useCaseExecutor.execute(
                findByTokenUseCase,
                new FindByTokenUseCase.InputValues(token),
                FindByTokenUseCase.OutputValues::refreshToken
        );
    }

    private CompletableFuture<RefreshToken> verifyTokenNotExpire(RefreshToken token) {
        return useCaseExecutor.execute(
                verifyTokenExpirationUseCase,
                new VerifyTokenExpirationUseCase.InputValues(token),
                VerifyTokenExpirationUseCase.OutputValues::token);
    }

    private CompletableFuture<RefreshToken> updateRefreshToken(RefreshToken token) {
        return useCaseExecutor.execute(
                updateRefreshTokenUseCase,
                new UpdateRefreshTokenUseCase.InputValues(token, refreshTokenExpirationMs),
                UpdateRefreshTokenUseCase.OutputValues::token);
    }
}
