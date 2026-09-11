package com.careerai.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;

    @Builder.Default
    private String type = "Bearer";

    private UserSummary user;

    // Direct properties for backwards compatibility
    private Long id;
    private String fullName;
    private String email;
}
