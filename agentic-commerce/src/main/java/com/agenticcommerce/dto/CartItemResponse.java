package com.agenticcommerce.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private String id;

    private String productId;

    private String productName;

    private BigDecimal price;

    private Integer quantity;

    private Integer stock;

    private BigDecimal subtotal;
}