package com.agenticcommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @Column(
            length = 30,
            nullable = false,
            unique = true,
            updatable = false
    )
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String category;

    @Column(
            nullable = false,
            precision = 12,
            scale = 2
    )
    private BigDecimal price;

    @Column(nullable = false)
    @Builder.Default
    private Integer stock = 0;

    @Column(nullable = false, length = 30)
    private String sellerId;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @Transient
    public String getStockStatus() {

        if (stock == null || stock <= 0) {
            return "OUT_OF_STOCK";
        }

        return "IN_STOCK";
    }

    @PrePersist
    public void generateId() {

        if (id == null) {

            id = "prod_" +
                    UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 10);
        }
    }
}