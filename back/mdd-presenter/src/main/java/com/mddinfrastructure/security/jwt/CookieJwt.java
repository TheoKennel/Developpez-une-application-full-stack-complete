package com.mddinfrastructure.security.jwt;

import com.mddcore.domain.models.User;
import com.mddinfrastructure.security.userdetails.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

/**
 * Utility class for handling JWT cookies.
 */
@Component
public class CookieJwt {

    @Value("${mdd.app.jwtCookieName}")
    private String jwtCookie;

    @Value("${mdd.app.jwtRefreshCookieName}")
    private String jwtRefreshCookie;

    private final JwtTokenProvider jwtTokenProvider;

    public CookieJwt(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * Generates a JWT cookie based on the provided UserDetails.
     *
     * @param customUserDetails The UserDetails object containing user details.
     * @return The generated JWT cookie.
     */
    public ResponseCookie generateJwtCookie(CustomUserDetails customUserDetails) {
        String jwt = jwtTokenProvider.createToken(customUserDetails);
        return generateCookie(jwtCookie, jwt, "/api");
    }

    /**
     * Generates a JWT cookie based on the provided User.
     *
     * @param user The user object.
     * @return The generated JWT cookie.
     */
    public ResponseCookie generateJwtCookie(User user) {
        CustomUserDetails customUserDetails = new CustomUserDetails(user);
        String jwt = jwtTokenProvider.createToken(customUserDetails);
        return generateCookie(jwtCookie, jwt, "/api");
    }

    /**
     * Generates a JWT refresh cookie.
     *
     * @param refreshToken The refresh token.
     * @return The generated JWT refresh cookie.
     */
    public ResponseCookie generateRefreshJwtCookie(String refreshToken) {
        return generateCookie(jwtRefreshCookie, refreshToken, "/api/auth/refresh-token");
    }

    /**
     * Retrieves the JWT from the cookies in the HttpServletRequest.
     *
     * @param request The HttpServletRequest object.
     * @return The JWT retrieved from the cookies.
     */
    public String getJwtFromCookies(HttpServletRequest request) {
        return getCookieValueByName(request, jwtCookie);
    }

    /**
     * Retrieves the JWT refresh token from the cookies in the HttpServletRequest.
     *
     * @param request The HttpServletRequest object.
     * @return The JWT refresh token retrieved from the cookies.
     */
    public String getJwtRefreshFromCookies(HttpServletRequest request) {
        return getCookieValueByName(request, jwtRefreshCookie);
    }

    /**
     * Gets a clean JWT cookie (to delete it).
     *
     * @return A clean JWT cookie.
     */
    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(jwtRefreshCookie, "").path("/api").maxAge(0).build();
    }

    /**
     * Gets a clean JWT refresh cookie (to delete it).
     *
     * @return A clean JWT refresh cookie.
     */
    public ResponseCookie getCleanJwtRefreshCookie() {
        return ResponseCookie.from(jwtRefreshCookie, "").path("/api/auth/refresh-token").maxAge(0).build();
    }

    private ResponseCookie generateCookie(String name, String value, String path) {
        return ResponseCookie.from(name, value).path(path).maxAge(24 * 60 * 60)
                .httpOnly(false).sameSite("None").secure(true).build();
    }

    private String getCookieValueByName(HttpServletRequest request, String name) {
        Cookie cookie = WebUtils.getCookie(request, name);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }
}
