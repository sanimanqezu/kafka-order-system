package com.sanele.kafkaorder.service;

import com.sanele.kafkaorder.config.Topics;
import com.sanele.kafkaorder.dto.OrderResponse;
import com.sanele.kafkaorder.dto.PlaceOrderRequest;
import com.sanele.kafkaorder.event.OrderPlaced;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;

import java.math.BigDecimal;
import java.util.concurrent.CompletableFuture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private KafkaTemplate<String, Object> kafkaTemplate;

    @InjectMocks
    private OrderService orderService;

    @Test
    void placeOrder_publishesOrderPlacedKeyedByOrderId() {
        when(kafkaTemplate.send(eq(Topics.ORDERS), any(), any()))
                .thenReturn(new CompletableFuture<SendResult<String, Object>>());

        PlaceOrderRequest request =
                new PlaceOrderRequest("Sanele", "Mechanical Keyboard", 2, new BigDecimal("499.99"));

        OrderResponse response = orderService.placeOrder(request);

        assertThat(response.orderId()).isNotBlank();
        assertThat(response.status()).isEqualTo("PLACED");

        ArgumentCaptor<String> keyCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<OrderPlaced> eventCaptor = ArgumentCaptor.forClass(OrderPlaced.class);
        verify(kafkaTemplate).send(eq(Topics.ORDERS), keyCaptor.capture(), eventCaptor.capture());

        assertThat(keyCaptor.getValue()).isEqualTo(response.orderId());

        OrderPlaced published = eventCaptor.getValue();
        assertThat(published.orderId()).isEqualTo(response.orderId());
        assertThat(published.customerName()).isEqualTo("Sanele");
        assertThat(published.product()).isEqualTo("Mechanical Keyboard");
        assertThat(published.quantity()).isEqualTo(2);
        assertThat(published.amount()).isEqualByComparingTo("499.99");
        assertThat(published.placedAt()).isNotNull();
    }
}
