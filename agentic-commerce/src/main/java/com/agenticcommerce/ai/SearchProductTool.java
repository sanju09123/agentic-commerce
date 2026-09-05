package com.agenticcommerce.ai;

import com.agenticcommerce.dto.ProductResponse;
import com.agenticcommerce.dto.ProductSearchRequest;
import com.agenticcommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.tool.annotation.Tool;
import org.springframework.ai.tool.annotation.ToolParam;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class SearchProductTool {

    private final ProductService productService;

    @Tool(
            name = "searchProducts",
            description = """
                    Search the real Agentic Commerce product database.

                    Use this when the user wants to find products,
                    search by name or brand, filter by category,
                    filter by price, or find products that are
                    currently in stock.
                    """
    )
    public List<ProductResponse> searchProducts(

            @ToolParam(
                    description = "Product name, type, or brand. Null if not specified."
            )
            String keyword,

            @ToolParam(
                    description = "Broad category such as electronics, clothing, or groceries. Null if not specified."
            )
            String category,

            @ToolParam(
                    description = "Minimum price. Null if not specified."
            )
            BigDecimal minPrice,

            @ToolParam(
                    description = "Maximum price. Null if not specified."
            )
            BigDecimal maxPrice,

            @ToolParam(
                    description = "Whether to return only products currently in stock."
            )
            Boolean inStock) {

        ProductSearchRequest request =
                ProductSearchRequest.builder()
                        .keyword(keyword)
                        .category(category)
                        .minPrice(minPrice)
                        .maxPrice(maxPrice)
                        .inStock(
                                inStock == null || inStock
                        )
                        .build();

        return productService.searchProducts(request);
    }
}