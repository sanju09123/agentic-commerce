package com.agenticcommerce.dto;

import com.agenticcommerce.entity.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponse {

    private String paymentId;

    private String orderId;

    private String razorpayOrderId;

    private BigDecimal amount;

    private PaymentStatus status;
}