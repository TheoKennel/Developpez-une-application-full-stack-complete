package com.mddcore.usecases.ut.comment;

import com.mddcore.domain.models.Article;
import com.mddcore.domain.models.Comment;
import com.mddcore.domain.repository.ICommentRepository;
import com.mddcore.usecases.article.GetArticleUseCase;
import com.mddcore.usecases.comment.CreateCommentUseCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
public class CreateCommentUseCaseUnitTest {
    @InjectMocks
    private CreateCommentUseCase useCase;
    @Mock
    private GetArticleUseCase getArticleUseCase;
    @Mock
    private ICommentRepository commentRepository;

    @Test
    public void CreateComment_ShouldReturnTrue_WhenNotAlreadyComment() {
        Article article = new Article();
        article.setId(1L);

        Comment comment = new Comment();
        comment.setAuthor("theo");
        comment.setId(1L);
        comment.setArticle(new Article());
        comment.setContent("Content");

        List<Comment> commentList = new ArrayList<>();
        commentList.add(comment);

        article.setCommentsList(commentList);

        doReturn(new GetArticleUseCase.OutputValues(article)).when(getArticleUseCase)
                .execute(new GetArticleUseCase.InputValues(1L));

        CreateCommentUseCase.InputRequest inputRequest = new CreateCommentUseCase.InputRequest(
                "Test unitaire work",
                1L,
                "nobody"
        );

        CreateCommentUseCase.InputValues inputValues = new CreateCommentUseCase.InputValues(
                inputRequest
        );
        CreateCommentUseCase.OutputValues outputValues = useCase.execute(inputValues);

        assertTrue(outputValues.success());
    }

    @Test
    public void CreateComment_ShouldReturnFalse_WhenAlreadyComment() {
        Article article = new Article();
        article.setId(1L);

        Comment comment = new Comment();
        comment.setAuthor("theo");
        List<Comment> commentList = new ArrayList<>();
        commentList.add(comment);

        article.setCommentsList(commentList);

        doReturn(new GetArticleUseCase.OutputValues(article)).when(getArticleUseCase).execute(new GetArticleUseCase.InputValues(1L));

        CreateCommentUseCase.InputRequest inputRequest = new CreateCommentUseCase.InputRequest(
                "Test unitaire work",
                1L,
                "theo"
        );
        CreateCommentUseCase.InputValues inputValues = new CreateCommentUseCase.InputValues(
                inputRequest
        );

        assertThatThrownBy(() -> useCase.execute(inputValues))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Already Commented");
    }
}
