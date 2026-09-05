package com.agenticcommerce.dto;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {

    private String cartId;

    private List<CartItemResponse> items;

    private BigDecimal totalAmount;
}