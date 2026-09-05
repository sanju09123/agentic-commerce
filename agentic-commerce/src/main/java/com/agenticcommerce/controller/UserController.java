package com.agenticcommerce.controller;

import com.agenticcommerce.dto.UpdateProfileRequest;
import com.agenticcommerce.dto.UserProfileResponse;
import com.agenticcommerce.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile() {

        return ResponseEntity.ok(
                userService.getProfile()
        );
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request
    ) {

        return ResponseEntity.ok(
                userService.updateProfile(request)
        );
    }

    @PutMapping("/profile/location")
    public ResponseEntity<UserProfileResponse> updateLocation(
            @RequestParam Double latitude,
            @RequestParam Double longitude
    ) {

        return ResponseEntity.ok(
                userService.updateLocation(latitude, longitude)
        );
    }
}