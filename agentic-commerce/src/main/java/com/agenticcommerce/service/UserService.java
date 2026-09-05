package com.agenticcommerce.service;

import com.agenticcommerce.dto.UpdateProfileRequest;
import com.agenticcommerce.dto.UserProfileResponse;
import com.agenticcommerce.entity.User;
import com.agenticcommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        String userId = authentication.getName();

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional(readOnly = true)
    public UserProfileResponse getProfile() {

        User user = getLoggedInUser();

        return mapToProfileResponse(user);
    }

    @Transactional
    public UserProfileResponse updateProfile(UpdateProfileRequest request) {

        User user = getLoggedInUser();

        user.setName(request.getName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setProfilePicture(request.getProfilePicture());
        user.setAddress(request.getAddress());
        user.setCity(request.getCity());
        user.setState(request.getState());
        user.setPincode(request.getPincode());

        User savedUser = userRepository.save(user);

        return mapToProfileResponse(savedUser);
    }

    @Transactional
    public UserProfileResponse updateLocation(
            Double latitude,
            Double longitude
    ) {

        if (latitude == null || longitude == null) {
            throw new RuntimeException("Latitude and longitude are required");
        }

        if (latitude < -90 || latitude > 90) {
            throw new RuntimeException("Invalid latitude");
        }

        if (longitude < -180 || longitude > 180) {
            throw new RuntimeException("Invalid longitude");
        }

        User user = getLoggedInUser();

        user.setLatitude(latitude);
        user.setLongitude(longitude);

        User savedUser = userRepository.save(user);

        return mapToProfileResponse(savedUser);
    }

    private UserProfileResponse mapToProfileResponse(User user) {

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .profilePicture(user.getProfilePicture())
                .address(user.getAddress())
                .city(user.getCity())
                .state(user.getState())
                .pincode(user.getPincode())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .role(user.getRole())
                .build();
    }
}