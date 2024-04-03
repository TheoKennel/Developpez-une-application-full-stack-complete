package com.mddinfrastructure.config;

import com.mddcore.domain.repository.*;
import com.mddcore.usecases.article.CreateArticleUseCase;
import com.mddcore.usecases.article.GetAllArticleUseCase;
import com.mddcore.usecases.article.GetArticleUseCase;
import com.mddcore.usecases.auth.IPasswordEncodeFinal;
import com.mddcore.usecases.comment.CreateCommentUseCase;
import com.mddcore.usecases.comment.GetAllCommentUseCase;
import com.mddcore.usecases.subject.GetAllSubjectUseCase;
import com.mddcore.usecases.subject.GetSubjectUseCase;
import com.mddcore.usecases.subscription.AddSubscriptionUseCase;
import com.mddcore.usecases.subscription.RemoveSubscriptionUseCase;
import com.mddcore.usecases.user.*;
import com.mddcore.usecases.user.token.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

/**
 * Configuration class for defining beans related to core use cases.
 */
@Configuration
public class CoreConfigImpl {

    // USER
    @Bean
    public GetUserUseCase getUserUseCase(IUserRepository userRepository) {
        return new GetUserUseCase(userRepository);
    }
    @Bean
    public DeleteUserUseCase deleteUserUseCase(IUserRepository userRepository) {
        return new DeleteUserUseCase(userRepository);
    }

    @Bean
    public UpdateUserUseCase updateUserUseCase(IUserRepository userRepository) {
        return new UpdateUserUseCase(userRepository);
    }

    // SUBSCRIPTION
    @Bean
    public AddSubscriptionUseCase addSubscriptionUseCase(ISubscriptionRepository subscriptionRepository, IUserRepository userRepository, ISubjectRepository subjectRepository) {
        return new AddSubscriptionUseCase(subscriptionRepository, userRepository, subjectRepository);
    }

    @Bean
    public RemoveSubscriptionUseCase removeSubscriptionUseCase(ISubscriptionRepository subscriptionRepository) {
        return new RemoveSubscriptionUseCase(subscriptionRepository);
    }

    // AUTH
    @Bean
    public RegisterUseCase registerUseCase(IUserRepository userRepository, IPasswordEncodeFinal passwordEncodeFinal) {
        return new RegisterUseCase(userRepository, passwordEncodeFinal);
    }

    @Bean
    public LogoutUserUseCase logoutUserUseCase(IRefreshTokenRepository repository) {
        return new LogoutUserUseCase(repository);
    }

    // REFRESH TOKEN
    @Bean
    public CreateRefreshTokenUseCase createRefreshTokenUseCase(IRefreshTokenRepository repository, IUserRepository userRepository) {
        return new CreateRefreshTokenUseCase(repository, userRepository);
    }

    @Bean
    @Transactional
    public DeleteRefreshTokenUseCase deleteRefreshTokenUseCase(IRefreshTokenRepository repository) {
        return new DeleteRefreshTokenUseCase(repository);
    }

    @Bean
    public FindByTokenUseCase findByTokenUseCase(IRefreshTokenRepository repository) {
        return new FindByTokenUseCase(repository);
    }

    @Bean
    public VerifyTokenExpirationUseCase verifyExpirationUseCase(IRefreshTokenRepository repository) {
        return new VerifyTokenExpirationUseCase(repository);
    }

    @Bean
    public UpdateRefreshTokenUseCase updateRefreshTokenUseCase(IRefreshTokenRepository repository) {
        return new UpdateRefreshTokenUseCase(repository);
    }
    // COMMENT
    @Bean
    public CreateCommentUseCase createCommentUseCase(ICommentRepository commentRepository, GetArticleUseCase getArticleUseCase) {
        return new CreateCommentUseCase(commentRepository, getArticleUseCase);
    }
    @Bean
    public GetAllCommentUseCase getAllCommentUseCase(ICommentRepository commentRepository) {
        return new GetAllCommentUseCase(commentRepository);
    }

    // SUBJECT
    @Bean
    public GetAllSubjectUseCase getAllSubjectUseCase(ISubjectRepository subjectRepository) {
        return new GetAllSubjectUseCase(subjectRepository);
    }
    @Bean
    public GetSubjectUseCase getSubjectUseCase(ISubjectRepository subjectRepository) {
        return new GetSubjectUseCase(subjectRepository);
    }

    // ARTICLE
    @Bean
    public CreateArticleUseCase createArticleUseCase(IArticleRepository articleRepository, GetSubjectUseCase getSubjectUseCase,
                                                     GetUserUseCase getUserUseCase) {
        return new CreateArticleUseCase(articleRepository, getSubjectUseCase, getUserUseCase);
    }
    @Bean
    public GetAllArticleUseCase getAllArticleUseCase(IArticleRepository articleRepository) {
        return new GetAllArticleUseCase(articleRepository);
    }
    @Bean
    public GetArticleUseCase getArticleUseCase(IArticleRepository articleRepository) {
        return new GetArticleUseCase(articleRepository);
    }
}
