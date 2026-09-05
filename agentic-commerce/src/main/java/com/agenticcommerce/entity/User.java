package com.agenticcommerce.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

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


    @Column(nullable = false, unique = true)
    private String email;


    @Column(nullable = false)
    private String password;


    @Column(nullable = false)
    @Builder.Default
    private String role = "CUSTOMER";

    @Column(length = 20)
    private String phoneNumber;

    @Column(length = 500)
    private String profilePicture;

    @Column(length = 500)
    private String address;


    @Column(length = 100)
    private String city;


    @Column(length = 100)
    private String state;


    @Column(length = 20)
    private String pincode;


    @Column
    private Double latitude;


    @Column
    private Double longitude;


    @PrePersist
    private void generateId() {

        if (id == null) {

            String prefix;

            if ("SELLER".equalsIgnoreCase(role)) {

                prefix = "slr_";

            } else {

                prefix = "usr_";

            }

            id = prefix +
                    UUID.randomUUID()
                            .toString()
                            .replace("-", "")
                            .substring(0, 10);
        }
    }
}