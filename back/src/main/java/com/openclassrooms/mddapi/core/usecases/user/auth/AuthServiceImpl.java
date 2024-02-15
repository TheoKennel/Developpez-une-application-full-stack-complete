package com.openclassrooms.mddapi.core.usecases.user.auth;

import com.openclassrooms.mddapi.core.usecases.user.UserMapper;
import com.openclassrooms.mddapi.core.usecases.user.auth.securityAuth.ITokenProvider;
import com.openclassrooms.mddapi.core.usecases.user.auth.securityAuth.IUserDetails;
import com.openclassrooms.mddapi.core.usecases.user.auth.securityAuth.IUserDetailsService;
import com.openclassrooms.mddapi.common.request.LoginRequest;
import com.openclassrooms.mddapi.core.usecases.user.dto.UserDto;
import com.openclassrooms.mddapi.common.exceptions.BadRequestException;
import com.openclassrooms.mddapi.common.exceptions.UnauthorizedException;
import com.openclassrooms.mddapi.core.domain.repository.IUserRepository;
import com.openclassrooms.mddapi.core.domain.models.User;


public class AuthServiceImpl implements IAuthService{
    private final ITokenProvider tokenProvider;
    private final IUserRepository userRepository;
    private final IUserDetailsService<IUserDetails> userDetailsService;
    private final UserMapper userMapper;

    public AuthServiceImpl(ITokenProvider tokenProvider, IUserRepository userRepository, IUserDetailsService<IUserDetails> userDetailsService, UserMapper userMapper) {
        this.tokenProvider = tokenProvider;
        this.userRepository = userRepository;
        this.userDetailsService = userDetailsService;
        this.userMapper = userMapper;
    }

    @Override
    public String login(LoginRequest request) {
        try {
            String token = tokenProvider.extractToken(request);
            if(token != null && tokenProvider.validateToken(token)) {
                String username = tokenProvider.getUsernameFromToken(token);
                IUserDetails userDetails = userDetailsService.loadUserByUsername(username);
                if(userDetails != null && userDetails.isEnabled()) {
                    return tokenProvider.createToken(username, userDetails.getAuthorities());
                }
            }
        } catch (Exception e) {
            throw  new UnauthorizedException("Problem with login request");
        }
        return null;
    }

    @Override
    public String register(UserDto userDto) {
        if(userRepository.existByEmail(userDto.getEmail())) {
            throw new BadRequestException("User email already exist");
        };
        if(!validPassword(userDto.getPassword())) {
            throw  new BadRequestException("Password security check failed");
        };
        User user = userMapper.toEntity(userDto);
        userRepository.save(user);
        return tokenProvider.createToken(user.getUsername(), null);
    }

    private Boolean validPassword(String password) {
        return password.length() >= 8
                && password.matches("^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).*$");
    }
}