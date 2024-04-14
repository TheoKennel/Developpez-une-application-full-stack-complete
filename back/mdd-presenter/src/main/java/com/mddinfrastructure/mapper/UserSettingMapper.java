package com.mddinfrastructure.mapper;


import com.mddcore.domain.models.User;
import com.mddinfrastructure.request.UserSettingRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface UserSettingMapper extends EntityMapper<User, UserSettingRequest> {
    UserSettingMapper INSTANCE = Mappers.getMapper(UserSettingMapper.class);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "subscriptionList", ignore = true)
    @Mapping(target = "picture", ignore = true)
    User toDomain(UserSettingRequest dto);
}
