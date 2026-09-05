package com.agenticcommerce.repository;

import com.agenticcommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface ProductRepository
        extends JpaRepository<Product, String> {

    List<Product> findByCategoryIgnoreCaseAndActiveTrue(
            String category
    );

    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(
            String name
    );


    List<Product>
    findByNameContainingIgnoreCaseAndPriceLessThanEqualAndActiveTrue(
            String name,
            BigDecimal maxPrice
    );


    List<Product>
    findByNameContainingIgnoreCaseAndPriceBetweenAndActiveTrue(
            String name,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    List<Product> findBySellerIdAndActiveTrue(
            String sellerId
    );

    Optional<Product>
    findByIdAndSellerIdAndActiveTrue(
            String id,
            String sellerId
    );

    Optional<Product> findByIdAndActiveTrue(
            String id
    );
}