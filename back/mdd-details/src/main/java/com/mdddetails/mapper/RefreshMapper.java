package com.mdddetails.mapper;

import com.mddcore.domain.models.RefreshToken;
import com.mdddetails.models.RefreshTokenEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UserDetailsMapper.class})
public interface RefreshMapper extends EntMapper<RefreshToken, RefreshTokenEntity> {
}
