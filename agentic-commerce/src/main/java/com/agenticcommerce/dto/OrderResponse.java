package com.agenticcommerce.dto;

import com.agenticcommerce.entity.OrderStatus;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private String orderId;

    private OrderStatus status;

    private List<OrderItemResponse> items;

    private BigDecimal totalAmount;
}