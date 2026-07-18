package com.sanele.kafkaorder.event;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderPlaced(
        String orderId,
        String customerName,
        String product,
        int quantity,
        BigDecimal amount,
        Instant placedAt
) {}
