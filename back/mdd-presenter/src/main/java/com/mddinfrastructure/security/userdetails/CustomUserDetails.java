package com.mddinfrastructure.security.userdetails;

import com.mddcore.domain.models.Subscription;
import com.mddcore.domain.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

@AllArgsConstructor
@Data
public class CustomUserDetails implements UserDetails {

    private final User user;
    private String username;
    private String password;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    public List<Subscription> getSubscriptions() {
        return user.getSubscriptionList();
    }
    public String getPictureUrl() {
        return user.getPicture();
    }
    public Long getId() {
        return user.getId();
    }

    public String getUserName() {
        return user.getUsername();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
