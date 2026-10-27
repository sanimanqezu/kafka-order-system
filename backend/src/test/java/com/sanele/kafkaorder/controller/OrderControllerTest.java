package com.sanele.kafkaorder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sanele.kafkaorder.dto.OrderResponse;
import com.sanele.kafkaorder.dto.PlaceOrderRequest;
import com.sanele.kafkaorder.service.OrderService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private OrderService orderService;

    @Test
    void placeOrder_returns202AndBody_whenRequestIsValid() throws Exception {
        when(orderService.placeOrder(any()))
                .thenReturn(new OrderResponse("order-1", "PLACED", "Order received and is being processed"));

        PlaceOrderRequest request =
                new PlaceOrderRequest("Sanele", "Mechanical Keyboard", 2, new BigDecimal("499.99"));

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.orderId").value("order-1"))
                .andExpect(jsonPath("$.status").value("PLACED"));
    }

    @Test
    void placeOrder_returns400_whenCustomerNameBlank() throws Exception {
        assertRejected(new PlaceOrderRequest("  ", "Keyboard", 1, new BigDecimal("10.00")));
    }

    @Test
    void placeOrder_returns400_whenProductBlank() throws Exception {
        assertRejected(new PlaceOrderRequest("Sanele", "", 1, new BigDecimal("10.00")));
    }

    @Test
    void placeOrder_returns400_whenQuantityNotPositive() throws Exception {
        assertRejected(new PlaceOrderRequest("Sanele", "Keyboard", 0, new BigDecimal("10.00")));
    }

    @Test
    void placeOrder_returns400_whenAmountNull() throws Exception {
        assertRejected(new PlaceOrderRequest("Sanele", "Keyboard", 1, null));
    }

    @Test
    void placeOrder_returns400_whenAmountNotPositive() throws Exception {
        assertRejected(new PlaceOrderRequest("Sanele", "Keyboard", 1, new BigDecimal("-5.00")));
    }

    private void assertRejected(PlaceOrderRequest invalid) throws Exception {
        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest());

        verify(orderService, never()).placeOrder(any());
    }
}
