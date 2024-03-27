package com.mddpresenter.usecases.it;

import com.mddinfrastructure.MddApiApplication;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.test.context.support.WithUserDetails;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MddApiApplication.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class SubscriptionControllerIntegrationTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Override
    protected MockMvc getMockMvc() {
        return mockMvc;
    }

    @Value("${mdd.app.jwtCookieName}")
    private String cookieName;

    @Value("${mdd.app.jwtRefreshCookieName}")
    private String jwtRefreshCookie;

    @Test
    @WithMockUser
    public void saveSubscription_ShouldReturnApiResponse_WithSuccess() throws Exception {
        RequestBuilder requestBuilder = asyncPostRequestWithCookies(
                "/api/subscription/3/1", "", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Add subscription successfully"));
    }

    @Test
    @WithMockUser
    public void saveSubscription_ShouldReturnApiResponseFalse_WhenUserAlreadySubscribed() throws Exception {
        RequestBuilder requestBuilder = asyncPostRequestWithCookies(
                "/api/subscription/1/1", "", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Already subscribed to this subject"));
    }

    @Test
    @WithMockUser
    public void saveSubscription_ShouldReturnApiResponseFalse_WhenUserNotFound() throws Exception {
        RequestBuilder requestBuilder = asyncPostRequestWithCookies(
                "/api/subscription/100/1", "", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("User cannot be null"));
    }

    @Test
    @WithMockUser
    public void saveSubscription_ShouldReturnApiResponseFalse_WhenSubjectNotFound() throws Exception {
        RequestBuilder requestBuilder = asyncPostRequestWithCookies(
                "/api/subscription/1/10", "", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Subject cannot be null"));
    }

    @Test
    @WithMockUser
    @WithUserDetails(value = "user@gmail.com")
    public void removeSubscription_ShouldReturnApiResponse_WithSuccess() throws Exception {
        RequestBuilder requestBuilder = asyncDeleteRequest(
                "/api/subscription/1", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Subscription removed with success"));
    }

    @Test
    @WithMockUser
    @WithUserDetails(value = "user@gmail.com")
    public void removeSubscription_ShouldReturnApiResponseFalse_WhenBadSubscriptionId() throws Exception {
        RequestBuilder requestBuilder = asyncDeleteRequest(
                "/api/subscription/10", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Error while deleting subscription in db"));
    }

}
