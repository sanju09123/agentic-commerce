package com.agenticcommerce.controller;

import com.agenticcommerce.dto.CreateStoreRequest;
import com.agenticcommerce.dto.StoreResponse;
import com.agenticcommerce.dto.UpdateStoreRequest;
import com.agenticcommerce.service.StoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/stores")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @PostMapping
    public ResponseEntity<StoreResponse> createStore(
            @Valid @RequestBody CreateStoreRequest request) {

        return ResponseEntity.ok(
                storeService.createStore(request)
        );
    }

    @GetMapping("/my-store")
    public ResponseEntity<StoreResponse> getMyStore() {

        return ResponseEntity.ok(
                storeService.getMyStore()
        );
    }

    @PutMapping("/my-store")
    public ResponseEntity<StoreResponse> updateMyStore(
            @Valid @RequestBody UpdateStoreRequest request) {

        return ResponseEntity.ok(
                storeService.updateMyStore(request)
        );
    }
}
