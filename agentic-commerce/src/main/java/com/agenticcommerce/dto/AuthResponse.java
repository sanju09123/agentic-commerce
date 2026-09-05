package com.agenticcommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String userId;

    private String name;

    private String email;

    private String token;

    private String role;
}