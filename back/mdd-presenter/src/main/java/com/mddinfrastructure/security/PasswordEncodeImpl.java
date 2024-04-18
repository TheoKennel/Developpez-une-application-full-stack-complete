package com.mddinfrastructure.security;

import com.mddcore.usecases.auth.IPasswordEncodeFinal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class  PasswordEncodeImpl implements IPasswordEncodeFinal {

    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public PasswordEncodeImpl(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public String encodePass(String password) {
        return bCryptPasswordEncoder.encode(password);
    }
}
