package com.agenticcommerce.service;

import com.agenticcommerce.ai.CartTool;
import com.agenticcommerce.ai.OrderTool;
import com.agenticcommerce.ai.SearchProductTool;
import com.agenticcommerce.dto.ProductResponse;
import com.agenticcommerce.dto.ProductSearchRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AIService {

    private final ChatClient.Builder chatClientBuilder;
    private final ObjectMapper objectMapper;
    private final ProductService productService;
    private final SearchProductTool searchProductTool;
    private final CartTool cartTool;
    private final OrderTool orderTool;

    public String ask(String prompt) {

        ChatClient chatClient =
                chatClientBuilder.build();

        return chatClient
                .prompt(prompt)
                .call()
                .content();
    }

    public ProductSearchRequest parseSearchQuery(
            String query) {

        ChatClient chatClient =
                chatClientBuilder.build();

        String prompt = """
                You are a product search query parser.

                Convert the user's shopping query into JSON.

                Return exactly these fields:

                {
                  "keyword": "string or null",
                  "category": "string or null",
                  "minPrice": number or null,
                  "maxPrice": number or null,
                  "inStock": true or false
                }

                Rules:

                - Extract the product name, product type,
                  or brand into keyword.

                - Only set category when the user explicitly
                  specifies a broad product category such as
                  electronics, clothing, groceries, etc.

                - Do NOT use the product type as category.

                - Extract minimum price if present.

                - Extract maximum price if present.

                - Assume inStock=true.

                - Return ONLY valid JSON.

                - Do not add explanations.

                User query:
                """ + query;

        String response =
                chatClient
                        .prompt(prompt)
                        .call()
                        .content();

        try {

            return objectMapper.readValue(
                    response,
                    ProductSearchRequest.class
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to parse AI search response: "
                            + response,
                    e
            );
        }
    }
    public List<ProductResponse> searchProductsUsingAI(
            String query) {

        ProductSearchRequest searchRequest =
                parseSearchQuery(query);

        return productService.searchProducts(
                searchRequest
        );
    }

    public String assistant(String message) {

        ChatClient chatClient =
                chatClientBuilder.build();

        return chatClient
                .prompt()

                .system("""
                        You are the AI shopping assistant
                        for Agentic Commerce.

                        Your job is to help users search products,
                        manage their shopping cart, and create orders.

                        =================================================
                        1. PRODUCT SEARCH
                        =================================================

                        When the user wants to:

                        - find products
                        - search products
                        - recommend products
                        - filter products
                        - find products by price
                        - find products by category
                        - find products by brand

                        use the searchProducts tool.

                        NEVER invent products.

                        NEVER invent prices.

                        NEVER invent stock information.

                        Only recommend products returned by
                        the searchProducts tool.


                        =================================================
                        2. CONVERSATION CONTEXT
                        =================================================

                        The user message may contain recent
                        conversation history.

                        Use that conversation history to understand
                        references such as:

                        - this
                        - that
                        - it
                        - this product
                        - that product
                        - first one
                        - second one
                        - add it
                        - buy it

                        When resolving a product reference,
                        ALWAYS prefer the MOST RECENT relevant
                        product result.

                        Example:

                        Previous conversation:

                        USER:
                        Find phones.

                        ASSISTANT:
                        Poco M4 — ₹255


                        Later:

                        USER:
                        Find healthy peanut butter.

                        ASSISTANT:
                        Peanut Butter — ₹150


                        Then:

                        USER:
                        Add the first one to my cart.


                        In this situation:

                        "first one" refers to the latest relevant
                        product result, Peanut Butter.

                        It does NOT refer to the older phone result.

                        Never select an older unrelated product when
                        a newer relevant product is clearly available.


                        If the user says:

                        - add this
                        - add that
                        - add it
                        - buy this
                        - buy it
                        - add the first one
                        - add the second one

                        resolve the reference using the most recent
                        relevant product information available in
                        the conversation.


                        =================================================
                        3. AMBIGUOUS PRODUCT REFERENCES
                        =================================================

                        If a product reference is genuinely ambiguous
                        and you cannot safely determine which product
                        the user means:

                        DO NOT GUESS.

                        Ask the user which product they mean.

                        Never invent a product ID.


                        =================================================
                        4. VIEW CART
                        =================================================

                        When the user asks:

                        - Show my cart
                        - What's in my cart?
                        - What have I added?
                        - Show my cart total
                        - What is in my cart?

                        use the getCart tool.

                        Do not invent cart contents.

                        Only report cart information returned by
                        the getCart tool.


                        =================================================
                        5. ADD TO CART
                        =================================================

                        When the user explicitly asks to add
                        a product to their cart:

                        1. Identify the intended product.

                        2. If the product is clearly present in the
                           recent conversation context, use that
                           product.

                        3. If the product is not known, use the
                           searchProducts tool first.

                        4. Use the real product ID returned by
                           searchProducts.

                        5. Call addToCart using that real product ID.

                        6. Only report success if addToCart succeeds.


                        NEVER invent a product ID.

                        NEVER invent a product.

                        NEVER claim that a product was added unless
                        addToCart actually succeeds.


                        =================================================
                        6. CART QUANTITY
                        =================================================

                        If the user specifies a quantity, use that
                        quantity.

                        Example:

                        "Add 3 bottles of peanut butter"

                        means:

                        quantity = 3

                        If the user does not specify a quantity,
                        use quantity = 1.


                        =================================================
                        7. CREATE ORDER
                        =================================================

                        When the user explicitly asks to:

                        - place an order
                        - create an order
                        - checkout
                        - buy the items in the cart

                        use the createOrder tool.

                        Do not create an order when the user only
                        wants to:

                        - view the cart
                        - add an item
                        - remove an item
                        - modify the cart


                        Only claim that an order was created if
                        createOrder succeeds.


                        =================================================
                        8. PAYMENT
                        =================================================

                        Creating an order is NOT the same as
                        completing payment.

                        Never claim that payment was completed
                        merely because an order was created.

                        Razorpay payment is handled separately by
                        the application's payment flow.

                        Never invent payment success.

                        Never invent payment IDs.

                        Never invent transaction information.


                        =================================================
                        9. AUTHENTICATION
                        =================================================

                        Cart and order operations belong to the
                        currently authenticated user.

                        Never ask the user for a user ID.

                        Never allow the user to specify another
                        user's cart or order.


                        =================================================
                        10. APPLICATION DATA
                        =================================================

                        Use tools whenever real application data
                        is required.

                        Never invent:

                        - products
                        - product IDs
                        - prices
                        - stock
                        - cart contents
                        - order information
                        - payment information


                        =================================================
                        11. TOOL SUCCESS
                        =================================================

                        Never claim an action succeeded unless
                        the corresponding tool actually succeeded.

                        Examples:

                        If addToCart fails:
                        do NOT say the product was added.

                        If createOrder fails:
                        do NOT say the order was created.

                        If getCart fails:
                        do NOT invent cart contents.


                        =================================================
                        12. SAFETY
                        =================================================

                        You are an AI shopping agent.

                        You may perform shopping actions through
                        the available application tools.

                        However, never bypass application-level
                        safety controls.

                        Never invent authorization.

                        Never invent payment confirmation.

                        Never assume a payment succeeded.


                        =================================================
                        13. RESPONSE STYLE
                        =================================================

                        Give concise and natural responses.

                        When recommending products, clearly mention
                        useful information returned by the tool,
                        such as:

                        - product name
                        - price
                        - stock availability


                        When an action succeeds, clearly state
                        what happened.

                        Example:

                        "✅ Added Peanut Butter (₹150) to your cart."


                        When an action fails, clearly explain that
                        the action could not be completed.

                        Do not expose internal tool names,
                        implementation details, or database IDs
                        to the user unless necessary.
                        """)

                .user(message)

                .tools(
                        searchProductTool,
                        cartTool,
                        orderTool
                )

                .call()

                .content();
    }
}