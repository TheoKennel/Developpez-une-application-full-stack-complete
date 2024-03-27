package com.mddcore.usecases.comment;

import com.mddcore.domain.models.Article;
import com.mddcore.domain.models.Comment;
import com.mddcore.domain.repository.ICommentRepository;
import com.mddcore.usecases.UseCase;
import com.mddcore.usecases.article.GetArticleUseCase;

/**
 * Use case for creating a comment on an article.
 */
public class CreateCommentUseCase extends UseCase<CreateCommentUseCase.InputValues, CreateCommentUseCase.OutputValues> {
    private final ICommentRepository commentRepository;
    private final GetArticleUseCase getArticleUseCase;

    public CreateCommentUseCase(ICommentRepository commentRepository, GetArticleUseCase getArticleUseCase) {
        this.commentRepository = commentRepository;
        this.getArticleUseCase = getArticleUseCase;
    }

    /**
     * Attempts to create a comment for an article. Checks if the user has already commented on the article.
     * If the user has not commented, it saves a new comment.
     * @param input the input values containing the comment content, article ID, and username
     * @return the output values indicating success or failure (true if successful, false otherwise)
     */
    @Override
    public OutputValues execute(InputValues input) {
        if (isAlreadyComment(input)) {
            throw new IllegalStateException("Already Commented");
        }

        Comment comment = new Comment(null, input.inputRequest.content(), getArticle(input), input.inputRequest.username());
        commentRepository.save(comment);
        return new OutputValues(true);
    }

    private Article getArticle(InputValues input) {
        GetArticleUseCase.InputValues inputValues = new GetArticleUseCase.InputValues(input.inputRequest.articleId());
        return getArticleUseCase.execute(inputValues).article();
    }

    private Boolean isAlreadyComment(InputValues input) {
        Article article = getArticle(input);
        return article.getCommentsList().stream()
                .anyMatch(comment -> comment.getAuthor().equals(input.inputRequest.username()));
    }

    public record InputValues(InputRequest inputRequest) implements UseCase.InputValues {
    }

    public record OutputValues(Boolean success) implements UseCase.OutputValues {
    }

    public record InputRequest(String content, Long articleId, String username) implements UseCase.InputRequest {
    }
}

