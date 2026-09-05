package com.agenticcommerce.service;

import com.agenticcommerce.dto.CreateStoreRequest;
import com.agenticcommerce.dto.StoreResponse;
import com.agenticcommerce.dto.UpdateStoreRequest;
import com.agenticcommerce.entity.Store;
import com.agenticcommerce.entity.User;
import com.agenticcommerce.repository.StoreRepository;
import com.agenticcommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreRepository storeRepository;
    private final UserRepository userRepository;

    private User getLoggedInSeller() {

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "Seller is not authenticated"
            );
        }

        String sellerId = authentication.getName();

        User seller = userRepository.findById(sellerId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Seller not found"
                        )
                );

        if (!"SELLER".equalsIgnoreCase(seller.getRole())) {

            throw new RuntimeException(
                    "Only sellers can manage a store"
            );
        }

        return seller;
    }

    @Transactional
    public StoreResponse createStore(
            CreateStoreRequest request) {

        User seller = getLoggedInSeller();

        String sellerId = seller.getId();

        if (storeRepository.existsBySellerId(sellerId)) {

            throw new RuntimeException(
                    "You already have a store"
            );
        }

        Store store = Store.builder()
                .sellerId(sellerId)
                .name(request.getName())
                .description(request.getDescription())
                .logo(request.getLogo())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .active(true)
                .build();

        Store savedStore =
                storeRepository.save(store);

        return mapToResponse(savedStore);
    }

    @Transactional(readOnly = true)
    public StoreResponse getMyStore() {

        User seller = getLoggedInSeller();

        String sellerId = seller.getId();

        Store store =
                storeRepository.findBySellerId(sellerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Store not found"
                                )
                        );

        return mapToResponse(store);
    }

    @Transactional
    public StoreResponse updateMyStore(
            UpdateStoreRequest request) {

        User seller = getLoggedInSeller();

        String sellerId = seller.getId();

        Store store =
                storeRepository.findBySellerId(sellerId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Store not found"
                                )
                        );

        store.setName(request.getName());
        store.setDescription(request.getDescription());
        store.setLogo(request.getLogo());
        store.setAddress(request.getAddress());
        store.setCity(request.getCity());
        store.setState(request.getState());
        store.setPincode(request.getPincode());

        Store savedStore =
                storeRepository.save(store);

        return mapToResponse(savedStore);
    }

    private StoreResponse mapToResponse(Store store) {

        return StoreResponse.builder()
                .id(store.getId())
                .sellerId(store.getSellerId())
                .name(store.getName())
                .description(store.getDescription())
                .logo(store.getLogo())
                .address(store.getAddress())
                .city(store.getCity())
                .state(store.getState())
                .pincode(store.getPincode())
                .active(store.getActive())
                .build();
    }
}