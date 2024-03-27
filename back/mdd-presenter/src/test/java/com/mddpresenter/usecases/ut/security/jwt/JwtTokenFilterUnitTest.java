package com.mddpresenter.usecases.ut.security.jwt;

import com.mddinfrastructure.security.jwt.CookieJwt;
import com.mddinfrastructure.security.jwt.JwtTokenFilter;
import com.mddinfrastructure.security.jwt.JwtTokenProvider;
import com.mddinfrastructure.security.userdetails.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JwtTokenFilterUnitTest {

    @InjectMocks
    private JwtTokenFilter jwtTokenFilter;
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    @Mock
    private CookieJwt cookieJwt;
    @Mock
    private CustomUserDetailsService userDetailsService;
    @Mock
    private HttpServletRequest request;
    @Mock
    private HttpServletResponse response;
    @Mock
    private FilterChain chain;

    @Test
    public void doFilterInternal_ValidToken_ShouldAuthenticateUser() throws Exception {
        String fakeJwtToken = "fakeToken";


        when(cookieJwt.getJwtFromCookies(request)).thenReturn(fakeJwtToken);
        when(jwtTokenProvider.validateToken(fakeJwtToken)).thenReturn(true);
        when(jwtTokenProvider.getUserId(fakeJwtToken)).thenReturn(1L);

        UserDetails mockUserDetails = mock(UserDetails.class);
        when(userDetailsService.loadUserById(1L)).thenReturn(mockUserDetails);

        jwtTokenFilter.doFilter(request, response, chain);

        verify(chain).doFilter(request, response);
        verify(userDetailsService).loadUserById(1L);
        verify(jwtTokenProvider).validateToken(fakeJwtToken);
        verify(cookieJwt).getJwtFromCookies(request);

        UsernamePasswordAuthenticationToken authentication =
                (UsernamePasswordAuthenticationToken) SecurityContextHolder.getContext().getAuthentication();

        assertNotNull(authentication);
        assertEquals(mockUserDetails, authentication.getPrincipal());
    }

    @Test
    void doFilterInternal_WhenExceptionIsThrown_ShouldLogErrorAndContinueFilterChain() throws Exception {
        String fakeJwtToken = "fakeToken";

        when(cookieJwt.getJwtFromCookies(request)).thenReturn(fakeJwtToken);
        when(jwtTokenProvider.validateToken(fakeJwtToken)).thenThrow(RuntimeException.class);

        jwtTokenFilter.doFilter(request, response, chain);
        verify(chain).doFilter(request, response);

    }
}
