package com.agenticcommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreResponse {

    private String id;

    private String sellerId;

    private String name;

    private String description;

    private String logo;

    private String address;

    private String city;

    private String state;

    private String pincode;

    private Boolean active;
}