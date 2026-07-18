package com.sanele.kafkaorder.dto;

public record OrderResponse(
        String orderId,
        String status,
        String message
) {}
