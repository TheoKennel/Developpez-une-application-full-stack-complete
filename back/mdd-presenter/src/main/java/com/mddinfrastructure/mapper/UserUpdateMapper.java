package com.mddinfrastructure.mapper;

import com.mddcore.domain.models.User;
import com.mddinfrastructure.request.UserUpdateRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserUpdateMapper extends EntityMapper<User, UserUpdateRequest>{
    UserUpdateMapper INSTANCE = Mappers.getMapper(UserUpdateMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subscriptionList", ignore = true)
    @Mapping(target = "picture", ignore = true)
    @Mapping(target = "password", ignore = true)
    User toDomain(UserUpdateMapper dto);
}
