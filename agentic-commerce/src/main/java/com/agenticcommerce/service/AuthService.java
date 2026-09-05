package com.agenticcommerce.service;

import com.agenticcommerce.dto.AuthResponse;
import com.agenticcommerce.dto.LoginRequest;
import com.agenticcommerce.dto.RegisterRequest;
import com.agenticcommerce.entity.User;
import com.agenticcommerce.repository.UserRepository;
import com.agenticcommerce.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException(
                    "Email already registered"
            );
        }

        String role = request.getRole();

        if (role == null ||
                (!role.equalsIgnoreCase("CUSTOMER")
                        && !role.equalsIgnoreCase("SELLER"))) {

            throw new RuntimeException(
                    "Role must be CUSTOMER or SELLER"
            );
        }

        role = role.toUpperCase();

        User user = User.builder()

                .name(request.getName())

                .email(request.getEmail())

                .password(
                        passwordEncoder.encode(
                                request.getPassword()
                        )
                )

                .role(role)

                .build();

        User savedUser =
                userRepository.save(user);

        String token =
                jwtService.generateToken(
                        savedUser.getId(),
                        savedUser.getEmail(),
                        savedUser.getRole()
                );

        return AuthResponse.builder()

                .userId(savedUser.getId())

                .name(savedUser.getName())

                .email(savedUser.getEmail())

                .role(savedUser.getRole())

                .token(token)

                .build();
    }

    public AuthResponse login(
            LoginRequest request
    ) {

        User user =
                userRepository.findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid email or password"
                                )
                        );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }

        String token =
                jwtService.generateToken(
                        user.getId(),
                        user.getEmail(),
                        user.getRole()
                );

        return AuthResponse.builder()

                .userId(user.getId())

                .name(user.getName())

                .email(user.getEmail())

                .role(user.getRole())

                .token(token)

                .build();
    }
}