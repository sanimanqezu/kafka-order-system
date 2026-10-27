package com.sanele.kafkaorder;

import com.sanele.kafkaorder.config.Topics;
import com.sanele.kafkaorder.dto.OrderResponse;
import com.sanele.kafkaorder.dto.OrderStatusUpdate;
import com.sanele.kafkaorder.dto.PlaceOrderRequest;
import com.sanele.kafkaorder.service.OrderService;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoSpyBean;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

/**
 * Exercises the whole path with a real (embedded) broker: placing an order
 * publishes OrderPlaced, which is serialized to JSON, consumed, deserialized,
 * and broadcast to the browser as an OrderStatusUpdate. This is what proves the
 * producer/consumer serialization config (JsonSerializer + trusted packages)
 * actually lines up end to end.
 */
@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = {Topics.ORDERS})
@TestPropertySource(properties = "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}")
class OrderFlowIntegrationTest {

    @Autowired
    private OrderService orderService;

    @MockitoSpyBean
    private SimpMessagingTemplate messagingTemplate;

    @Test
    void placingOrderReachesTheBrowserAsPlacedStatus() {
        PlaceOrderRequest request =
                new PlaceOrderRequest("Sanele", "Mechanical Keyboard", 2, new BigDecimal("499.99"));

        OrderResponse response = orderService.placeOrder(request);

        ArgumentCaptor<OrderStatusUpdate> captor = ArgumentCaptor.forClass(OrderStatusUpdate.class);
        verify(messagingTemplate, timeout(10_000)).convertAndSend(eq("/topic/orders"), captor.capture());

        OrderStatusUpdate update = captor.getValue();
        assertThat(update.orderId()).isEqualTo(response.orderId());
        assertThat(update.customerName()).isEqualTo("Sanele");
        assertThat(update.product()).isEqualTo("Mechanical Keyboard");
        assertThat(update.status()).isEqualTo("PLACED");
        assertThat(update.updatedAt()).isNotNull();
    }
}
