package com.mddpresenter.usecases.it;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mddinfrastructure.MddApiApplication;
import com.mddinfrastructure.request.ArticleRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.RequestBuilder;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest(classes = MddApiApplication.class)
@AutoConfigureMockMvc
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_CLASS)
public class ArticleControllerIntegrationTest extends BaseControllerTest {

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
    public void GetAllArticles_ShouldReturnListOfArticlesResponse() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/article", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].title").value("Article 1"))
                .andExpect(jsonPath("$.[4].title").value("Article 5"));
    }

    @Test
    @WithMockUser
    public void GetArticleById_ShouldReturnArticlesResponse_WithValidId() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/article/1", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Article 1"))
                .andExpect(jsonPath("$.content").value("article 1"));
    }

    @Test
    @WithMockUser
    public void GetArticleById_ShouldReturnApiResponseFalse_WithBadId() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/article/9", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Article not found with id : 9"));
    }

    @Test
    @WithMockUser
    public void SaveArticle_ShouldReturnApiResponseTrue_WithValidRequest() throws Exception {
        ArticleRequest articleRequest = new ArticleRequest(
                1L,
                1L,
                "title",
                "content"
        );
        String payload = new ObjectMapper().writeValueAsString(articleRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithCookies("/api/article/create", payload ,cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Article created"));
    }

    @Test
    @WithMockUser
    public void SaveArticle_ShouldReturnApiResponseFalse_WithBadUserIdInRequest() throws Exception {
        ArticleRequest articleRequest = new ArticleRequest(
                1L,
                17L,
                "title",
                "content"
        );
        String payload = new ObjectMapper().writeValueAsString(articleRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithCookies("/api/article/create", payload ,cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Error while creating new Article, cant be save : java.lang.IllegalArgumentException: User not found with id : 17"));
    }

    @Test
    @WithMockUser
    public void SaveArticle_ShouldReturnApiResponseFalse_WithBadSubjectIdInRequest() throws Exception {
        ArticleRequest articleRequest = new ArticleRequest(
                18L,
                1L,
                "title",
                "content"
        );
        String payload = new ObjectMapper().writeValueAsString(articleRequest);
        RequestBuilder requestBuilder = asyncPostRequestWithCookies("/api/article/create", payload ,cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Error while creating new Article, cant be save : java.lang.IllegalArgumentException: Subject not found with id : 18"));
    }
}