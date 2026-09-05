package com.agenticcommerce.controller;

import com.agenticcommerce.dto.ProductDetailsResponse;
import com.agenticcommerce.dto.ProductRequest;
import com.agenticcommerce.dto.ProductResponse;
import com.agenticcommerce.dto.ProductSearchRequest;
import com.agenticcommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts() {

        return ResponseEntity.ok(
                productService.getAllProducts()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchProducts(
            @ModelAttribute ProductSearchRequest request) {

        return ResponseEntity.ok(
                productService.searchProducts(request)
        );
    }

    @GetMapping("/{productId}")
    public ResponseEntity<ProductDetailsResponse> getProductDetails(
            @PathVariable String productId) {

        return ResponseEntity.ok(
                productService.getProductDetails(productId)
        );
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request,
            Authentication authentication) {

        String sellerId =
                authentication.getName();

        ProductResponse response =
                productService.createProduct(
                        request,
                        sellerId
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping("/seller")
    public ResponseEntity<List<ProductResponse>> getSellerProducts(
            Authentication authentication) {

        String sellerId =
                authentication.getName();

        return ResponseEntity.ok(
                productService.getSellerProducts(
                        sellerId
                )
        );
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(
            @PathVariable String productId,
            Authentication authentication) {

        String sellerId =
                authentication.getName();

        productService.deleteProduct(
                productId,
                sellerId
        );

        return ResponseEntity
                .noContent()
                .build();
    }

    @PutMapping("/{productId}/stock")
    public ResponseEntity<ProductResponse> updateStock(
            @PathVariable String productId,
            @RequestBody StockUpdateRequest request,
            Authentication authentication) {

        String sellerId =
                authentication.getName();

        ProductResponse response =
                productService.updateStock(
                        productId,
                        sellerId,
                        request.getStock()
                );

        return ResponseEntity.ok(response);
    }

    public static class StockUpdateRequest {

        private Integer stock;

        public Integer getStock() {
            return stock;
        }

        public void setStock(Integer stock) {
            this.stock = stock;
        }
    }
}