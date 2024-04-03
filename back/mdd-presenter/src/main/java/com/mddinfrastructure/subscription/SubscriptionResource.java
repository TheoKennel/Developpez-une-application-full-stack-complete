package com.mddinfrastructure.subscription;

import com.mddinfrastructure.response.ApiResponse;
import com.mddinfrastructure.response.SubscriptionResponse;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/subscription")
interface SubscriptionResource {

    @PostMapping("/{userId}/{subjectId}")
    CompletableFuture<SubscriptionResponse> saveSubscription(@PathVariable Long userId,
                                                             @PathVariable Long subjectId);

    @DeleteMapping("/{subscriptionId}")
    CompletableFuture<ApiResponse> removeSubscription(@PathVariable Long subscriptionId);
}
