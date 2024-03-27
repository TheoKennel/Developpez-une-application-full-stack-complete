package com.mddpresenter.usecases.it;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mddinfrastructure.MddApiApplication;
import com.mddinfrastructure.request.CommentRequest;
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
public class CommentControllerIntegrationTest extends BaseControllerTest {

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
    public void CreateComment_ShouldReturnCommentResponseAsList() throws Exception {
        CommentRequest commentRequest = new CommentRequest(
                "what a comment",
                "theo",
                4L
        );

        String payload = new ObjectMapper().writeValueAsString(commentRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithCookies("/api/comment/create", payload ,cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Create Comment successfully"));
    }

    @Test
    @WithUserDetails("user@gmail.com")
    public void CreateComment_ShouldReturnApiResponseFalse_WhenUserAlreadyCommented() throws Exception {
        CommentRequest commentRequest = new CommentRequest(
                "what a comment",
                "theo",
                2L
        );
        String payload = new ObjectMapper().writeValueAsString(commentRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithCookies("/api/comment/create", payload ,cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Already Commented"));
    }

    @Test
    @WithMockUser
    public void getComments_ShouldReturnCommentResponseAsList() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/comment", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("commentaire 1"))
                .andExpect(jsonPath("$[1].content").value("commentaire 2"))
                .andExpect(jsonPath("$[1].username").value("theo"));
    }
}
