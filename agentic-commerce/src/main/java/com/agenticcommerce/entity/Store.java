package com.agenticcommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(
        name = "stores",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_store_seller",
                        columnNames = "seller_id"
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @Column(length = 30, nullable = false, unique = true, updatable = false)
    private String id;

    @Column(name = "seller_id", length = 30, nullable = false, unique = true, updatable = false)
    private String sellerId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 1000)
    private String description;

    @Column(length = 500)
    private String logo;

    @Column(length = 500)
    private String address;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 20)
    private String pincode;

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;

    @PrePersist
    private void generateId() {

        if (id == null) {

            id = "str_" +
                    UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 10);
        }

        if (active == null) {
            active = true;
        }
    }
}
