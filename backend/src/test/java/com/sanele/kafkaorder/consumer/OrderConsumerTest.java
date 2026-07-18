package com.sanele.kafkaorder.consumer;

import com.sanele.kafkaorder.dto.OrderStatusUpdate;
import com.sanele.kafkaorder.event.OrderPlaced;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class OrderConsumerTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private OrderConsumer orderConsumer;

    @Test
    void onOrderPlaced_broadcastsPlacedStatusToBrowser() {
        OrderPlaced event = new OrderPlaced(
                "order-1", "Sanele", "Mechanical Keyboard", 1, new BigDecimal("499.99"), Instant.now());

        orderConsumer.onOrderPlaced(event);

        ArgumentCaptor<OrderStatusUpdate> captor = ArgumentCaptor.forClass(OrderStatusUpdate.class);
        verify(messagingTemplate).convertAndSend(eq("/topic/orders"), captor.capture());

        OrderStatusUpdate update = captor.getValue();
        assertThat(update.orderId()).isEqualTo("order-1");
        assertThat(update.customerName()).isEqualTo("Sanele");
        assertThat(update.product()).isEqualTo("Mechanical Keyboard");
        assertThat(update.status()).isEqualTo("PLACED");
    }
}
