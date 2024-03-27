package com.mddpresenter.usecases.it;

import com.mddinfrastructure.MddApiApplication;
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
public class SubjectControllerIntegrationTest extends BaseControllerTest {

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
    public void GetAllSubject_ShouldReturnListOfSubjectResponse() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/subject", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == 1)].name").value("Java"))
                .andExpect(jsonPath("$[?(@.id == 3)].name").value("Spring Framework"))
                .andExpect(jsonPath("$.length()").value(6));
    }

    @Test
    @WithMockUser
    public void GetSubjectById_ShouldSubjectResponseWithValidId() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/subject/1", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.id == 1)].name").value("Java"));
    }

    @Test
    @WithMockUser
    public void GetSubjectById_ShouldThrowExceptionWhenSubjectNotFound() throws Exception {
        RequestBuilder requestBuilder = asyncGetRequestWithCookies("/api/subject/10", cookieName, jwtRefreshCookie);

        mockMvc.perform(requestBuilder)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value("Subject not found with id : 10" ));
    }
}
