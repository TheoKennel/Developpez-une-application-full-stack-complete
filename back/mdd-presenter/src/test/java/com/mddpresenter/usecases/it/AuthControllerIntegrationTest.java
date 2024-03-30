package com.mddpresenter.usecases.it;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mddcore.usecases.auth.SignInRequest;
import com.mddinfrastructure.MddApiApplication;
import com.mddinfrastructure.request.UserSettingRequest;
import com.mddinfrastructure.security.jwt.JwtTokenProvider;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;

import static org.hamcrest.Matchers.is;
import static org.mockito.Mockito.doReturn;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = MddApiApplication.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class AuthControllerIntegrationTest extends BaseControllerTest {

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

    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    public void RegisterAndLoginUser_ShouldRegisterUserThenLogin_WithStatusOkForBoth() throws Exception {
        UserSettingRequest settingRequest = new UserSettingRequest(
            "theokennel@gmail.com",
            "123456&Theo",
            "theo");

        String signInRequestJson = new ObjectMapper().writeValueAsString(settingRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithoutCookie("/api/auth/register", signInRequestJson);
        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email", is(settingRequest.email())));
    }

    @Test
    public void RegisterUser_ShouldThrowUserAlreadyExist( ) throws Exception {
        UserSettingRequest userSettingRequest = new UserSettingRequest(
                "alreadyRegister@gmail.com",
                        "hashed_passworD&25",
                "theo");
        String settingRequest = new ObjectMapper().writeValueAsString(userSettingRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithoutCookie("/api/auth/register", settingRequest);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("User email already exist"))
                .andExpect(jsonPath("$.success").value(false))
                .andReturn();

    }

    @Test
    public void LoginUser_ShouldThrowException_WhenUserEnterWrongEmail() throws Exception {
        SignInRequest signInRequest = new SignInRequest(
                "wrong@gmail.com",
                "123456&Theo"
        );

        String request = new ObjectMapper().writeValueAsString(signInRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithoutCookie("/api/auth/login", request);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Bad credential"))
                .andExpect(jsonPath("$.success").value(false))
                .andReturn();
    }


    @Test
    public void LoginUser_ShouldLogUser_AndReturnAuthResponseWithStatus200() throws Exception {
        SignInRequest signInRequest = new SignInRequest(
                "theokennel@gmail.com",
                "123456&Theo"
        );

        String request = new ObjectMapper().writeValueAsString(signInRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithoutCookie("/api/auth/login", request);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(cookie().exists(cookieName))
                .andExpect(cookie().exists(jwtRefreshCookie))
                .andReturn();
    }

    @Test
    @WithMockUser
    public void LogoutUser_ShouldLogoutUser_AndReturnAuthResponseWithStatus200ThanCleanCookies() throws Exception {
        doReturn(4L).when(jwtTokenProvider).getAuthenticateUser();
        RequestBuilder requestBuilder = asyncDeleteRequest("/api/auth/signout/4", cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(cookie().maxAge(jwtRefreshCookie, 0))
                .andExpect(content().string("You've been signed out successfully!"));
    }
}
