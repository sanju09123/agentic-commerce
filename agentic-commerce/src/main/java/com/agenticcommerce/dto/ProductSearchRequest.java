package com.agenticcommerce.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductSearchRequest {

    private String keyword;

    private String category;

    private BigDecimal minPrice;

    private BigDecimal maxPrice;

    private Boolean inStock;
}