package com.agenticcommerce.ai;

import com.agenticcommerce.dto.AddToCartRequest;
import com.agenticcommerce.dto.CartResponse;
import com.agenticcommerce.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CartTool {

    private final CartService cartService;

    @Tool(
            name = "getCart",
            description = """
                    Get the currently logged-in user's shopping cart.

                    Use this when the user asks:
                    - What is in my cart?
                    - Show my cart
                    - Show my cart total
                    - What products have I added?

                    Only return information from the actual cart.
                    Never invent cart contents.
                    """
    )
    public CartResponse getCart() {

        return cartService.getCart();
    }

    @Tool(
            name = "addToCart",
            description = """
                    Add a product to the currently logged-in user's
                    shopping cart.

                    Use this ONLY when the user explicitly asks to:
                    - add a product to the cart
                    - put a product in the cart
                    - add a specific product

                    The productId must be the real product ID returned
                    by the searchProducts tool.

                    Do not invent product IDs.
                    """
    )
    public CartResponse addToCart(

            @ToolParam(
                    description = "Real product ID returned by searchProducts"
            )
            String productId,

            @ToolParam(
                    description = "Number of units to add. Must be at least 1."
            )
            Integer quantity
    ) {

        if (productId == null || productId.isBlank()) {
            throw new IllegalArgumentException(
                    "Product ID is required"
            );
        }

        if (quantity == null || quantity < 1) {
            throw new IllegalArgumentException(
                    "Quantity must be at least 1"
            );
        }

        AddToCartRequest request =
                new AddToCartRequest();

        request.setProductId(productId);
        request.setQuantity(quantity);

        return cartService.addToCart(request);
    }
}