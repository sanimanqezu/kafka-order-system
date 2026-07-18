package com.sanele.kafkaorder.consumer;

import com.sanele.kafkaorder.config.Topics;
import com.sanele.kafkaorder.event.OrderPlaced;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.SpyBean;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.test.context.EmbeddedKafka;
import org.springframework.test.context.TestPropertySource;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.timeout;
import static org.mockito.Mockito.verify;

@SpringBootTest
@EmbeddedKafka(partitions = 1, topics = {Topics.ORDERS})
@TestPropertySource(properties = "spring.kafka.bootstrap-servers=${spring.embedded.kafka.brokers}")
class OrderConsumerIntegrationTest {

    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;

    @SpyBean
    private OrderConsumer orderConsumer;

    @Test
    void consumerReceivesPublishedOrderPlaced() {
        String orderId = UUID.randomUUID().toString();
        OrderPlaced event = new OrderPlaced(
                orderId, "Sanele", "Mechanical Keyboard", 1, new BigDecimal("499.99"), Instant.now());

        kafkaTemplate.send(Topics.ORDERS, orderId, event);

        ArgumentCaptor<OrderPlaced> captor = ArgumentCaptor.forClass(OrderPlaced.class);
        verify(orderConsumer, timeout(10_000)).onOrderPlaced(captor.capture());

        OrderPlaced received = captor.getValue();
        assertThat(received.orderId()).isEqualTo(orderId);
        assertThat(received.customerName()).isEqualTo("Sanele");
        assertThat(received.amount()).isEqualByComparingTo("499.99");
    }
}
