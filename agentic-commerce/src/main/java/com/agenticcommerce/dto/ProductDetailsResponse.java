package com.agenticcommerce.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductDetailsResponse {

    private String id;

    private String name;

    private String description;

    private String category;

    private BigDecimal price;

    private Integer stock;

    private String stockStatus;

    private Boolean active;

    private StoreSummaryResponse store;
}
