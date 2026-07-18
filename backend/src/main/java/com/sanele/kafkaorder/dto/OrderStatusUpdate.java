package com.sanele.kafkaorder.dto;

import java.time.Instant;

public record OrderStatusUpdate(
        String orderId,
        String customerName,
        String product,
        String status,
        Instant updatedAt
) {}
