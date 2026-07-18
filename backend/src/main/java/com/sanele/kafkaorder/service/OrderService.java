package com.sanele.kafkaorder.service;

import com.sanele.kafkaorder.config.Topics;
import com.sanele.kafkaorder.dto.OrderResponse;
import com.sanele.kafkaorder.dto.PlaceOrderRequest;
import com.sanele.kafkaorder.event.OrderPlaced;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public OrderResponse placeOrder(PlaceOrderRequest request) {
        String orderId = UUID.randomUUID().toString();
        OrderPlaced event = new OrderPlaced(
                orderId,
                request.customerName(),
                request.product(),
                request.quantity(),
                request.amount(),
                Instant.now()
        );

        kafkaTemplate.send(Topics.ORDERS, orderId, event)
                .whenComplete((result, ex) -> {
                    if (ex != null) {
                        log.error("Failed to publish OrderPlaced orderId={}", orderId, ex);
                    } else {
                        log.info("Published OrderPlaced orderId={} to partition={}",
                                orderId, result.getRecordMetadata().partition());
                    }
                });

        return new OrderResponse(orderId, "PLACED", "Order received and is being processed");
    }
}
