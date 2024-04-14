package com.mddpresenter.usecases.it;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mddinfrastructure.MddApiApplication;
import com.mddinfrastructure.request.UserSettingRequest;
import com.mddinfrastructure.request.UserUpdateRequest;
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

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MddApiApplication.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class UserControllerIntegrationTest extends BaseControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @Value("${mdd.app.jwtCookieName}")
    private String cookieName;
    @Value("${mdd.app.jwtRefreshCookieName}")
    private String jwtRefreshCookie;
    @MockBean
    private JwtTokenProvider jwtTokenProvider;

    @Override
    protected MockMvc getMockMvc() {
        return this.mockMvc;
    }

    @Test
    @WithMockUser
    public void getUserById_ShouldRetrieveUser_WithStatusValidId() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/user/1", cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder).andExpect(status().isOk()).andExpect(jsonPath("$.email").value("user@gmail.com"));
    }

    @Test
    @WithMockUser
    public void deleteUserById_ShouldDeleteUser_WithStatusValidId() throws Exception {
        when(jwtTokenProvider.getAuthenticateUser()).thenReturn(3L);
        RequestBuilder requestBuilder = asyncDeleteRequest("/api/user/3", cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder).andExpect(status().isOk()).andExpect(jsonPath("$.success").value(true)).andExpect(jsonPath("$.message").value("Delete user successfully"));
    }

    @Test
    @WithMockUser
    public void deleteUserById_ShouldThrownError_WhenUserDontMatchAuthId() throws Exception {
        when(jwtTokenProvider.getAuthenticateUser()).thenReturn(2L);
        RequestBuilder requestBuilder = asyncDeleteRequest("/api/user/1", cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder).andExpect(status().isBadRequest()).andExpect(jsonPath("$.success").value(false)).andExpect(jsonPath("$.message").value("User id don't match auth id"));
    }

    @Test
    @WithMockUser
    public void deleteUserById_ShouldThrownError_WhenUserNotFound() throws Exception {
        when(jwtTokenProvider.getAuthenticateUser()).thenReturn(2L);
        RequestBuilder requestBuilder = asyncDeleteRequest("/api/user/0", cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder).andExpect(status().isBadRequest()).andExpect(jsonPath("$.success").value(false)).andExpect(jsonPath("$.message").value("User not found, cant delete it"));
    }

    @Test
    @WithMockUser
    public void UpdateUser_ShouldUpdateUser_WithValidSettings() throws Exception {
        when(jwtTokenProvider.getAuthenticateUser()).thenReturn(2L);
        UserUpdateRequest userUpdateRequest = new UserUpdateRequest("UpdatedUsername","updatedEmail@example.com");
        String userSettingRequestJson = new ObjectMapper().writeValueAsString(userUpdateRequest);

        RequestBuilder requestBuilder = asyncPutRequestWithCookies("/api/user/2", userSettingRequestJson, cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder).andExpect(status().isOk()).andExpect(jsonPath("$.email").value(userUpdateRequest.email())).andExpect(jsonPath("$.username").value(userUpdateRequest.username()));
    }

    @Test
    @WithMockUser
    public void UpdateUser_ShouldThrowError_WithInvalidUserIdInPath() throws Exception {
        when(jwtTokenProvider.getAuthenticateUser()).thenReturn(2L);
        UserSettingRequest userSettingRequest = new UserSettingRequest("updatedEmail@example.com", "NewPassword123", "UpdatedUsername");
        String userSettingRequestJson = new ObjectMapper().writeValueAsString(userSettingRequest);

        RequestBuilder requestBuilder = asyncPutRequestWithCookies("/api/user/9", userSettingRequestJson, cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder).andExpect(status().isBadRequest()).andExpect(jsonPath("$.success").value(false)).andExpect(jsonPath("$.message").value("User to update not found"));
    }

    @Test
    @WithMockUser
    public void UpdateUser_ShouldThrowError_WithUserIdNotEqualToAuthId() throws Exception {
        when(jwtTokenProvider.getAuthenticateUser()).thenReturn(2L);
        UserSettingRequest userSettingRequest = new UserSettingRequest("updatedEmail@example.com", "NewPassword123", "UpdatedUsername");
        String userSettingRequestJson = new ObjectMapper().writeValueAsString(userSettingRequest);

        RequestBuilder requestBuilder = asyncPutRequestWithCookies("/api/user/1", userSettingRequestJson, cookieName, jwtRefreshCookie);
        mockMvc.perform(requestBuilder).andExpect(status().isBadRequest()).andExpect(jsonPath("$.success").value(false)).andExpect(jsonPath("$.message").value("Authenticate user don't match user to update"));
    }
}
