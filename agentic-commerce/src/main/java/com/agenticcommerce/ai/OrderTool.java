package com.agenticcommerce.ai;

import com.agenticcommerce.dto.OrderResponse;
import com.agenticcommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class OrderTool {

    private final OrderService orderService;

    @Tool(
            name = "createOrder",
            description = """
                    Create an order using the currently logged-in
                    user's current shopping cart.

                    Use this ONLY when the user explicitly asks to:
                    place an order, create an order, checkout,
                    or buy the items in the cart.

                    Do NOT use this tool for:
                    viewing the cart, adding products to the cart,
                    or asking about cart contents.

                    The order belongs to the currently authenticated user.
                    """
    )
    public OrderResponse createOrder() {
        return orderService.createOrder();
    }
}