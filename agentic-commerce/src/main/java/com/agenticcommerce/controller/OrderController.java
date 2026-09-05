package com.agenticcommerce.controller;

import com.agenticcommerce.dto.OrderResponse;
import com.agenticcommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder() {

        return ResponseEntity.ok(
                orderService.createOrder()
        );
    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders() {

        return ResponseEntity.ok(
                orderService.getMyOrders()
        );
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getMyOrder(
            @PathVariable String orderId) {

        return ResponseEntity.ok(
                orderService.getMyOrder(orderId)
        );
    }
}