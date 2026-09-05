package com.agenticcommerce.service;

import com.agenticcommerce.dto.AddToCartRequest;
import com.agenticcommerce.dto.CartItemResponse;
import com.agenticcommerce.dto.CartResponse;
import com.agenticcommerce.entity.Cart;
import com.agenticcommerce.entity.CartItem;
import com.agenticcommerce.entity.Product;
import com.agenticcommerce.entity.User;
import com.agenticcommerce.exception.InsufficientStockException;
import com.agenticcommerce.exception.ResourceNotFoundException;
import com.agenticcommerce.repository.CartRepository;
import com.agenticcommerce.repository.ProductRepository;
import com.agenticcommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Transactional
    public CartResponse addToCart(AddToCartRequest request) {

        User user = getLoggedInUser();
        Product product =
                productRepository
                        .findById(request.getProductId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Product not found"
                                )
                        );

        if (request.getQuantity() == null ||
                request.getQuantity() <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        if (!product.getActive()) {

            throw new RuntimeException(
                    "Product is no longer available"
            );
        }

        int currentStock =
                product.getStock() == null
                        ? 0
                        : product.getStock();

        if (currentStock < request.getQuantity()) {

            throw new InsufficientStockException(
                    "Insufficient stock"
            );
        }

        Cart cart =
                cartRepository
                        .findByUser(user)
                        .orElseGet(() ->
                                cartRepository.save(
                                        Cart.builder()
                                                .user(user)
                                                .build()
                                )
                        );

        CartItem existingItem =
                cart.getItems()
                        .stream()
                        .filter(item ->
                                item.getProduct()
                                        .getId()
                                        .equals(product.getId())
                        )
                        .findFirst()
                        .orElse(null);


        if (existingItem != null) {

            int currentQuantity =
                    existingItem.getQuantity();

            int newQuantity =
                    currentQuantity + request.getQuantity();


            if (currentStock < newQuantity) {

                throw new InsufficientStockException(
                        "Insufficient stock"
                );
            }


            existingItem.setQuantity(newQuantity);
        }

        else {

            CartItem cartItem =
                    CartItem.builder()
                            .cart(cart)
                            .product(product)
                            .quantity(request.getQuantity())
                            .build();

            cart.getItems().add(cartItem);
        }

        Cart savedCart =
                cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    @Transactional
    public CartResponse getCart() {

        User user = getLoggedInUser();

        Cart cart =
                cartRepository
                        .findByUser(user)
                        .orElseGet(() ->
                                cartRepository.save(
                                        Cart.builder()
                                                .user(user)
                                                .build()
                                )
                        );

        return mapToResponse(cart);
    }

    @Transactional
    public CartResponse updateQuantity(
            String cartItemId,
            Integer quantity
    ) {
        User user = getLoggedInUser();

        if (quantity == null || quantity <= 0) {

            throw new RuntimeException(
                    "Quantity must be greater than zero"
            );
        }

        Cart cart =
                cartRepository
                        .findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart not found"
                                )
                        );


        CartItem cartItem =
                cart.getItems()
                        .stream()
                        .filter(item ->
                                item.getId()
                                        .equals(cartItemId)
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart item not found"
                                )
                        );


        Product product =
                cartItem.getProduct();


        if (!product.getActive()) {

            throw new RuntimeException(
                    "Product is no longer available"
            );
        }

        cartItem.setQuantity(quantity);

        Cart savedCart =
                cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    @Transactional
    public CartResponse removeItem(
            String cartItemId
    ) {

        User user = getLoggedInUser();

        Cart cart =
                cartRepository
                        .findByUser(user)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart not found"
                                )
                        );

        CartItem cartItem =
                cart.getItems()
                        .stream()
                        .filter(item ->
                                item.getId()
                                        .equals(cartItemId)
                        )
                        .findFirst()
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Cart item not found"
                                )
                        );

        cart.getItems().remove(cartItem);

        Cart savedCart =
                cartRepository.save(cart);

        return mapToResponse(savedCart);
    }

    private User getLoggedInUser() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();


        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new RuntimeException(
                    "User is not authenticated"
            );
        }


        String userId =
                authentication.getName();


        return userRepository
                .findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    private CartResponse mapToResponse(
            Cart cart
    ) {

        List<CartItemResponse> items =
                cart.getItems()
                        .stream()
                        .map(this::mapItemToResponse)
                        .toList();

        BigDecimal totalAmount =
                items.stream()
                        .map(CartItemResponse::getSubtotal)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );


        return CartResponse.builder()

                .cartId(cart.getId())

                .items(items)

                .totalAmount(totalAmount)

                .build();
    }

    private CartItemResponse mapItemToResponse(
            CartItem item
    ) {

        BigDecimal subtotal =
                item.getProduct()
                        .getPrice()
                        .multiply(
                                BigDecimal.valueOf(
                                        item.getQuantity()
                                )
                        );


        int currentStock =
                item.getProduct().getStock() == null
                        ? 0
                        : item.getProduct().getStock();


        return CartItemResponse.builder()

                .id(item.getId())

                .productId(
                        item.getProduct().getId()
                )

                .productName(
                        item.getProduct().getName()
                )

                .price(
                        item.getProduct().getPrice()
                )

                .quantity(
                        item.getQuantity()
                )

                .stock(
                        currentStock
                )

                .subtotal(
                        subtotal
                )

                .build();
    }
}