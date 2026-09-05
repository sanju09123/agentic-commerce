package com.agenticcommerce.service;

import com.agenticcommerce.dto.ProductDetailsResponse;
import com.agenticcommerce.dto.ProductRequest;
import com.agenticcommerce.dto.ProductResponse;
import com.agenticcommerce.dto.ProductSearchRequest;
import com.agenticcommerce.dto.StoreSummaryResponse;
import com.agenticcommerce.entity.Product;
import com.agenticcommerce.entity.Store;
import com.agenticcommerce.repository.ProductRepository;
import com.agenticcommerce.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final StoreRepository storeRepository;

    public ProductResponse createProduct(
            ProductRequest request,
            String sellerId
    ) {

        if (!storeRepository.existsBySellerId(sellerId)) {

            throw new RuntimeException(
                    "Create your store before adding products"
            );
        }


        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .price(request.getPrice())
                .stock(
                        request.getStock() == null
                                ? 0
                                : request.getStock()
                )
                .sellerId(sellerId)
                .active(true)
                .build();

        Product savedProduct =
                productRepository.save(product);

        return mapToResponse(savedProduct);
    }


    public List<ProductResponse> getAllProducts() {

        return productRepository
                .findAll()
                .stream()
                .filter(Product::getActive)
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProductDetailsResponse getProductDetails(
            String productId
    ) {

        Product product =
                productRepository
                        .findByIdAndActiveTrue(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        Store store =
                storeRepository
                        .findBySellerId(product.getSellerId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Store not found for this product"
                                )
                        );

        StoreSummaryResponse storeResponse =
                StoreSummaryResponse.builder()
                        .name(store.getName())
                        .description(store.getDescription())
                        .build();

        return ProductDetailsResponse.builder()

                .id(product.getId())

                .name(product.getName())

                .description(product.getDescription())

                .category(product.getCategory())

                .price(product.getPrice())

                .stock(product.getStock())

                .stockStatus(
                        product.getStockStatus()
                )

                .active(product.getActive())

                .store(storeResponse)

                .build();
    }


    public List<ProductResponse> getSellerProducts(
            String sellerId
    ) {

        return productRepository
                .findBySellerIdAndActiveTrue(sellerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public void deleteProduct(
            String productId,
            String sellerId
    ) {

        Product product =
                productRepository
                        .findByIdAndSellerIdAndActiveTrue(
                                productId,
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        // Soft delete
        product.setActive(false);

        productRepository.save(product);
    }

    public ProductResponse updateStock(
            String productId,
            String sellerId,
            Integer stock
    ) {

        if (stock == null || stock < 0) {

            throw new RuntimeException(
                    "Stock cannot be negative"
            );
        }

        Product product =
                productRepository
                        .findByIdAndSellerIdAndActiveTrue(
                                productId,
                                sellerId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Product not found"
                                )
                        );

        product.setStock(stock);


        Product updatedProduct =
                productRepository.save(product);


        return mapToResponse(updatedProduct);
    }

    public List<ProductResponse> searchProducts(
            ProductSearchRequest request
    ) {

        return productRepository
                .findAll()
                .stream()
                .filter(Product::getActive)

                .filter(product ->
                        matchesKeyword(
                                product,
                                request.getKeyword()
                        )
                )

                .filter(product ->
                        matchesCategory(
                                product,
                                request.getCategory()
                        )
                )

                .filter(product ->
                        matchesMinPrice(
                                product,
                                request.getMinPrice()
                        )
                )

                .filter(product ->
                        matchesMaxPrice(
                                product,
                                request.getMaxPrice()
                        )
                )

                .filter(product ->
                        matchesStock(
                                product,
                                request.getInStock()
                        )
                )

                .map(this::mapToResponse)
                .toList();
    }

    private boolean matchesKeyword(
            Product product,
            String keyword
    ) {

        if (keyword == null || keyword.isBlank()) {
            return true;
        }

        String searchableText =
                (
                        product.getName()
                                + " "
                                + product.getDescription()
                                + " "
                                + product.getCategory()
                ).toLowerCase();

        String[] words =
                keyword
                        .toLowerCase()
                        .trim()
                        .split("\\s+");

        for (String word : words) {

            if (searchableText.contains(word)) {
                return true;
            }
        }

        return false;
    }


    private boolean matchesCategory(
            Product product,
            String category
    ) {

        if (category == null || category.isBlank()) {
            return true;
        }

        return product
                .getCategory()
                .equalsIgnoreCase(category);
    }


    private boolean matchesMinPrice(
            Product product,
            BigDecimal minPrice
    ) {

        if (minPrice == null) {
            return true;
        }

        return product
                .getPrice()
                .compareTo(minPrice) >= 0;
    }


    private boolean matchesMaxPrice(
            Product product,
            BigDecimal maxPrice
    ) {

        if (maxPrice == null) {
            return true;
        }

        return product
                .getPrice()
                .compareTo(maxPrice) <= 0;
    }


    private boolean matchesStock(
            Product product,
            Boolean inStock
    ) {

        if (inStock == null || !inStock) {
            return true;
        }

        return product.getStock() > 0;
    }


    private ProductResponse mapToResponse(
            Product product
    ) {

        return ProductResponse.builder()

                .id(product.getId())

                .name(product.getName())

                .description(product.getDescription())

                .category(product.getCategory())

                .price(product.getPrice())

                .stock(product.getStock())

                .stockStatus(
                        product.getStockStatus()
                )

                .active(product.getActive())

                .sellerId(product.getSellerId())

                .build();
    }
}