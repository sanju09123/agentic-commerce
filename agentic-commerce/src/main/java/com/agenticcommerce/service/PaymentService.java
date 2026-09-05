package com.agenticcommerce.service;

import com.agenticcommerce.dto.CreatePaymentRequest;
import com.agenticcommerce.dto.PaymentResponse;
import com.agenticcommerce.dto.VerifyPaymentRequest;
import com.agenticcommerce.entity.*;
import com.agenticcommerce.repository.CartRepository;
import com.agenticcommerce.repository.OrderRepository;
import com.agenticcommerce.repository.PaymentRepository;
import com.agenticcommerce.repository.ProductRepository;
import com.agenticcommerce.repository.UserRepository;
import com.razorpay.RazorpayClient;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key-id}")
    private String keyId;

    @Value("${razorpay.key-secret}")
    private String keySecret;

    @Transactional
    public PaymentResponse createPayment(
            CreatePaymentRequest request) {

        User user = getLoggedInUser();

        Order order = orderRepository
                .findById(request.getOrderId())
                .orElseThrow(() ->
                        new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to pay for this order"
            );
        }

        if (order.getStatus() == OrderStatus.PAID) {

            throw new RuntimeException(
                    "Order is already paid"
            );
        }

        if (order.getTotalAmount() == null ||
                order.getTotalAmount()
                        .compareTo(BigDecimal.ZERO) <= 0) {

            throw new RuntimeException(
                    "Invalid order amount"
            );
        }

        Payment existingPayment =
                paymentRepository
                        .findByOrderId(order.getId())
                        .orElse(null);

        if (existingPayment != null) {
            return mapToResponse(existingPayment);
        }

        try {

            RazorpayClient razorpayClient =
                    new RazorpayClient(
                            keyId,
                            keySecret
                    );

            JSONObject options = new JSONObject();

            long amountInPaise =
                    order.getTotalAmount()
                            .multiply(BigDecimal.valueOf(100))
                            .longValueExact();

            options.put("amount", amountInPaise);
            options.put("currency", "INR");
            options.put("receipt", order.getId());

            com.razorpay.Order razorpayOrder =
                    razorpayClient.orders.create(options);

            Payment payment = Payment.builder()
                    .order(order)
                    .razorpayOrderId(
                            razorpayOrder.get("id")
                    )
                    .amount(order.getTotalAmount())
                    .status(PaymentStatus.CREATED)
                    .build();

            Payment savedPayment =
                    paymentRepository.save(payment);

            return mapToResponse(savedPayment);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to create Razorpay payment order",
                    e
            );
        }
    }

    @Transactional
    public boolean verifyPayment(
            VerifyPaymentRequest request) {

        try {

            Payment payment =
                    paymentRepository
                            .findByRazorpayOrderId(
                                    request.getRazorpayOrderId()
                            )
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Payment not found"
                                    ));

            if (payment.getStatus() == PaymentStatus.PAID) {
                return true;
            }

            Order order = payment.getOrder();

            if (!payment.getRazorpayOrderId()
                    .equals(request.getRazorpayOrderId())) {

                throw new RuntimeException(
                        "Invalid Razorpay order"
                );
            }

            String payload =
                    request.getRazorpayOrderId()
                            + "|"
                            + request.getRazorpayPaymentId();

            Mac mac = Mac.getInstance("HmacSHA256");

            SecretKeySpec secretKeySpec =
                    new SecretKeySpec(
                            keySecret.getBytes(
                                    StandardCharsets.UTF_8
                            ),
                            "HmacSHA256"
                    );

            mac.init(secretKeySpec);

            byte[] hash =
                    mac.doFinal(
                            payload.getBytes(
                                    StandardCharsets.UTF_8
                            )
                    );

            String generatedSignature =
                    bytesToHex(hash);

            if (!java.security.MessageDigest
                    .isEqual(
                            generatedSignature.getBytes(
                                    StandardCharsets.UTF_8
                            ),
                            request.getRazorpaySignature()
                                    .getBytes(
                                            StandardCharsets.UTF_8
                                    )
                    )) {

                return false;
            }

            if (order.getStatus() == OrderStatus.PAID) {

                payment.setStatus(
                        PaymentStatus.PAID
                );

                paymentRepository.save(payment);

                return true;
            }
            for (OrderItem orderItem :
                    order.getItems()) {

                Product product =
                        orderItem.getProduct();

                if (!product.getActive()) {

                    throw new RuntimeException(
                            "Product is no longer available: "
                                    + product.getName()
                    );
                }

                if (product.getStock()
                        < orderItem.getQuantity()) {

                    throw new RuntimeException(
                            "Insufficient stock for: "
                                    + product.getName()
                    );
                }
            }

            for (OrderItem orderItem :
                    order.getItems()) {

                Product product =
                        orderItem.getProduct();

                product.setStock(
                        product.getStock()
                                - orderItem.getQuantity()
                );

                productRepository.save(product);
            }

            payment.setStatus(
                    PaymentStatus.PAID
            );

            order.setStatus(
                    OrderStatus.PAID
            );
            paymentRepository.save(payment);
            orderRepository.save(order);

            Cart cart = cartRepository
                    .findByUser(order.getUser())
                    .orElse(null);

            if (cart != null) {

                cart.getItems().removeIf(
                        cartItem -> order.getItems()
                                .stream()
                                .anyMatch(orderItem ->
                                        orderItem
                                                .getProduct()
                                                .getId()
                                                .equals(
                                                        cartItem
                                                                .getProduct()
                                                                .getId()
                                                )
                                )
                );

                cartRepository.save(cart);
            }

            return true;

        } catch (Exception e) {

            throw new RuntimeException(
                    "Payment verification failed",
                    e
            );
        }
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
                        new RuntimeException(
                                "User not found"
                        ));
    }

    private PaymentResponse mapToResponse(
            Payment payment) {

        return PaymentResponse.builder()
                .paymentId(payment.getId())
                .orderId(
                        payment.getOrder().getId()
                )
                .razorpayOrderId(
                        payment.getRazorpayOrderId()
                )
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .build();
    }

    private String bytesToHex(byte[] bytes) {

        StringBuilder result =
                new StringBuilder();

        for (byte b : bytes) {

            result.append(
                    String.format(
                            "%02x",
                            b
                    )
            );
        }

        return result.toString();
    }
}