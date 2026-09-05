package com.agenticcommerce.controller;

import com.agenticcommerce.dto.ProductResponse;
import com.agenticcommerce.dto.ProductSearchRequest;
import com.agenticcommerce.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @GetMapping("/ask")
    public String ask(
            @RequestParam String prompt) {

        return aiService.ask(prompt);
    }

    @PostMapping("/search/parse")
    public ResponseEntity<ProductSearchRequest> parseSearch(
            @RequestParam String query) {

        return ResponseEntity.ok(
                aiService.parseSearchQuery(query)
        );
    }

    @PostMapping("/search")
    public ResponseEntity<List<ProductResponse>> searchUsingAI(
            @RequestParam String query) {

        return ResponseEntity.ok(
                aiService.searchProductsUsingAI(query)
        );
    }

    @PostMapping("/assistant")
    public ResponseEntity<String> assistant(
            @RequestParam String message) {

        return ResponseEntity.ok(
                aiService.assistant(message)
        );
    }
}