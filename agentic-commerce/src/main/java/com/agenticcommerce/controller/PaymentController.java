package com.agenticcommerce.controller;

import com.agenticcommerce.dto.CreatePaymentRequest;
import com.agenticcommerce.dto.PaymentResponse;
import com.agenticcommerce.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.agenticcommerce.dto.VerifyPaymentRequest;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(
            @Valid @RequestBody CreatePaymentRequest request) {

        return ResponseEntity.ok(
                paymentService.createPayment(request)
        );
    }
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @Valid @RequestBody VerifyPaymentRequest request) {

        boolean verified =
                paymentService.verifyPayment(request);

        if (!verified) {
            return ResponseEntity.badRequest()
                    .body("Payment verification failed");
        }

        return ResponseEntity.ok(
                "Payment verified successfully"
        );
    }
}