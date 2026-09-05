package com.agenticcommerce.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@Builder
public class ProductResponse {

    private String id;

    private String name;

    private String description;

    private String category;

    private BigDecimal price;

    private Integer stock;

    private String stockStatus;

    private Boolean active;

    private String sellerId;
}