package com.mddpresenter.usecases.ut.security.jwt;

import com.mddcore.domain.models.User;
import com.mddinfrastructure.security.jwt.JwtTokenProvider;
import com.mddinfrastructure.security.userdetails.CustomUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.util.ReflectionTestUtils;

import java.security.Key;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtTokenProviderUnitTest {
    private JwtTokenProvider jwtTokenProvider;
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private final long jwtExpiration = 604800000; // Example expiration time in milliseconds

    @BeforeEach
    public void setup() {
        jwtTokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(jwtTokenProvider, "key", key);
        ReflectionTestUtils.setField(jwtTokenProvider, "jwtExpiration", jwtExpiration);
    }

    private CustomUserDetails generateMockCustomUserDetails() {
        CustomUserDetails mockUserDetails = mock(CustomUserDetails.class);
        User mockUser = new User();
        mockUser.setId(1L);
        when(mockUserDetails.getUser()).thenReturn(mockUser);
        return mockUserDetails;
    }

    @Test
    public void validateToken_WhenValid_ShouldReturnTrue() {
        String token = jwtTokenProvider.createToken(generateMockCustomUserDetails());
        boolean isValid = jwtTokenProvider.validateToken(token);
        assertTrue(isValid);
    }

    @Test
    public void validateToken_WhenInvalid_ShouldReturnFalse() {
        String token = "invalidToken";
        boolean isValid = jwtTokenProvider.validateToken(token);
        assertFalse(isValid);
    }

    @Test
    public void validateToken_WhenExpiredJwtException_ShouldLogErrorAndReturnFalse() {
        String expiredToken = "expiredToken";
        try (MockedStatic<Jwts> jwtsMockedStatic = mockStatic(Jwts.class)) {
            JwtParser mockJwtParser = mock(JwtParser.class);
            when(Jwts.parser()).thenReturn(mockJwtParser);
            when(mockJwtParser.setSigningKey(any(Key.class))).thenReturn(mockJwtParser);
            when(mockJwtParser.parseClaimsJws(expiredToken)).thenThrow(ExpiredJwtException.class);

            assertFalse(jwtTokenProvider.validateToken(expiredToken));
        }
    }

    @Test
    public void validateToken_WhenUnsupportedJwtException_ShouldLogErrorAndReturnFalse() {
        String unsupportedToken = "unsupportedToken";
        try (MockedStatic<Jwts> jwtsMockedStatic = mockStatic(Jwts.class)) {
            JwtParser mockJwtParser = mock(JwtParser.class);
            when(Jwts.parser()).thenReturn(mockJwtParser);
            when(mockJwtParser.setSigningKey(any(Key.class))).thenReturn(mockJwtParser);
            when(mockJwtParser.parseClaimsJws(unsupportedToken)).thenThrow(UnsupportedJwtException.class);

            assertFalse(jwtTokenProvider.validateToken(unsupportedToken));
        }
    }

    @Test
    public void validateToken_WhenIllegalArgumentException_ShouldLogErrorAndReturnFalse() {
        String emptyClaimsToken = "emptyClaimsToken";
        try (MockedStatic<Jwts> jwtsMockedStatic = mockStatic(Jwts.class)) {
            JwtParser mockJwtParser = mock(JwtParser.class);
            when(Jwts.parser()).thenReturn(mockJwtParser);
            when(mockJwtParser.setSigningKey(any(Key.class))).thenReturn(mockJwtParser);
            when(mockJwtParser.parseClaimsJws(emptyClaimsToken)).thenThrow(IllegalArgumentException.class);

            assertFalse(jwtTokenProvider.validateToken(emptyClaimsToken));
        }
    }

    @Test
    public void getAuthenticateUser_WhenAuthenticated_ShouldReturnUserId() {
        Authentication authentication = mock(Authentication.class);
        CustomUserDetails customUserDetails = generateMockCustomUserDetails();
        when(authentication.getPrincipal()).thenReturn(customUserDetails);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        Long userId = jwtTokenProvider.getAuthenticateUser();

        assertEquals(customUserDetails.getUser().getId(), userId);
    }

    @Test
    public void getAuthenticateUser_WhenAuthenticationIsNull_ShouldThrowIllegalStateException() {
        SecurityContextHolder.getContext().setAuthentication(null);

        assertThrows(IllegalStateException.class, () -> jwtTokenProvider.getAuthenticateUser());
    }

    @Test
    public void getAuthenticateUser_WhenPrincipalIsNotCustomUserDetails_ShouldThrowIllegalStateException() {
        Authentication authentication = mock(Authentication.class);
        when(authentication.getPrincipal()).thenReturn(new Object()); // Not a CustomUserDetails instance
        SecurityContextHolder.getContext().setAuthentication(authentication);

        assertThrows(IllegalStateException.class, () -> jwtTokenProvider.getAuthenticateUser());
    }

    @Test
    void getUserId_WhenCalled_ShouldReturnUserId() {
        String token = "dummyToken";
        long expectedUserId = 1L;

        try (MockedStatic<Jwts> jwtsMockedStatic = mockStatic(Jwts.class)) {
            JwtParser mockJwtParser = mock(JwtParser.class);
            Jws mockJws = mock(Jws.class);
            Claims mockClaims = mock(Claims.class);

            jwtsMockedStatic.when(Jwts::parser).thenReturn(mockJwtParser);
            when(mockJwtParser.setSigningKey(key)).thenReturn(mockJwtParser);
            when(mockJwtParser.parseClaimsJws(token)).thenReturn(mockJws);
            when(mockJws.getBody()).thenReturn(mockClaims);
            when(mockClaims.getSubject()).thenReturn(String.valueOf(expectedUserId));

            Long userId = jwtTokenProvider.getUserId(token);

            assertEquals(expectedUserId, userId);
        }
    }

}
