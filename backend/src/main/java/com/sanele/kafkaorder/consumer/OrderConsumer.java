package com.sanele.kafkaorder.consumer;

import com.sanele.kafkaorder.config.Topics;
import com.sanele.kafkaorder.dto.OrderStatusUpdate;
import com.sanele.kafkaorder.event.OrderPlaced;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class OrderConsumer {

    private static final String ORDERS_DESTINATION = "/topic/orders";

    private final SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = Topics.ORDERS)
    public void onOrderPlaced(OrderPlaced event) {
        log.info("Received OrderPlaced orderId={} customer={} product={}",
                event.orderId(), event.customerName(), event.product());

        OrderStatusUpdate update = new OrderStatusUpdate(
                event.orderId(),
                event.customerName(),
                event.product(),
                "PLACED",
                Instant.now());
        messagingTemplate.convertAndSend(ORDERS_DESTINATION, update);
    }
}
