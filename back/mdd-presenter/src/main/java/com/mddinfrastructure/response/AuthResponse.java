package com.mddinfrastructure.response;

import java.util.List;

public record AuthResponse(
        Long id,
        String picture,
        String userName,
        List<SubscriptionResponse> subscriptions
) {
}
