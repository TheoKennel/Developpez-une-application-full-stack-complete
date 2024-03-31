package com.mdddetails.mapper;

import com.mddcore.domain.models.Article;
import com.mdddetails.models.ArticleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {SubjectMapper.class, CommentMapper.class, UserDetailsMapper.class})
public interface ArticleMapper extends EntMapper<Article, ArticleEntity> {

    @Override
    @Mapping(target = "createdAt", ignore = true)
    ArticleEntity toEntity(Article domain);
}
