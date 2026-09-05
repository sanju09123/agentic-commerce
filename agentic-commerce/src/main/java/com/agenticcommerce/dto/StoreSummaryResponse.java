package com.agenticcommerce.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreSummaryResponse {

    private String name;

    private String description;
}