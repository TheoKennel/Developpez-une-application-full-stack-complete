package com.mddinfrastructure.comment;

import com.mddcore.domain.models.Comment;
import com.mddcore.usecases.UseCaseExecutor;
import com.mddcore.usecases.comment.CreateCommentUseCase;
import com.mddcore.usecases.comment.GetAllCommentUseCase;
import com.mddinfrastructure.request.CommentRequest;
import com.mddinfrastructure.response.ApiResponse;
import com.mddinfrastructure.response.CommentResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;
import java.util.concurrent.CompletableFuture;

/**
 * Controller for managing comments.
 */
@Component
public class CommentController implements CommentResource{
    private final UseCaseExecutor useCaseExecutor;
    private final GetAllCommentUseCase getAllCommentUseCase;
    private final CreateCommentUseCase createCommentUseCase;

    public CommentController(UseCaseExecutor useCaseExecutor,
                             GetAllCommentUseCase getAllCommentUseCase, CreateCommentUseCase createCommentUseCase) {
        this.useCaseExecutor = useCaseExecutor;
        this.getAllCommentUseCase = getAllCommentUseCase;
        this.createCommentUseCase = createCommentUseCase;
    }

    /**
     * Retrieves all comments.
     * @return A CompletableFuture containing a list of CommentResponse objects.
     */
    @Override
    public CompletableFuture<List<CommentResponse>> getComments() {
     CompletableFuture<List<Comment>> commentList =
             useCaseExecutor.execute(
                getAllCommentUseCase,
                new GetAllCommentUseCase.InputValues(),
                GetAllCommentUseCase.OutputValues::commentList);

     return commentList.thenApply(CommentResponse::from);
    }

    /**
     * Creates a new comment.
     * @param request The request object containing information about the comment.
     * @return A CompletableFuture containing an ApiResponse indicating the success of the operation.
     */
    @Override
    public CompletableFuture<ApiResponse> create(@RequestBody CommentRequest request) {
               return useCaseExecutor.execute(
                createCommentUseCase,
                new CreateCommentUseCase.InputValues(new CreateCommentUseCase.InputRequest(
                        request.content(),
                        request.article_id(),
                        request.userName())),
                        outputValues -> new ApiResponse(outputValues.success(), "Create Comment successfully"));
    }
}
