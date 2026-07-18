# Kafka Order System

An event-driven order pipeline built with **Spring Boot 3** and **Apache Kafka**, streaming live order events to a **Next.js 16** dashboard over WebSockets. Place an order via REST and watch it appear on the frontend in real time — no polling.

## Architecture

```
                POST /api/orders
   Client  ───────────────────────▶  OrderController
                                          │
                                          ▼
                                     OrderService  ──publish──▶  Kafka topic: "orders" (3 partitions)
                                                                        │
                                                                        ▼
   Next.js UI  ◀──STOMP / SockJS──  OrderConsumer  ◀──@KafkaListener──┘
                  /topic/orders
```

The producer accepts the order, publishes an `OrderPlaced` event to Kafka, and returns `202 Accepted` immediately. A Kafka consumer picks the event up on the `order-service` consumer group and pushes a status update to every connected browser through a STOMP WebSocket broker. The write path and the notification path are fully decoupled by the broker.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 17, Spring Boot 3.2.5, Spring Kafka, Spring WebSocket (STOMP) |
| Messaging | Apache Kafka 3.9 (KRaft mode — no ZooKeeper) |
| Frontend | Next.js 16, React 19, `@stomp/stompjs` + `sockjs-client`, Tailwind CSS 4, Framer Motion |
| Serialization | JSON (`JsonSerializer` / `JsonDeserializer`, trusted packages) |
| Testing | JUnit 5, `spring-kafka-test` (embedded Kafka integration tests) |
| Tooling | Maven, Docker Compose |

## Key design points

- **Decoupled write and notify paths** — the REST endpoint never waits for a consumer; Kafka absorbs the load and the consumer fans out to WebSocket clients independently.
- **KRaft-mode Kafka** — runs without ZooKeeper, configured entirely through `docker-compose.yml`.
- **3-partition topic** — created declaratively with a `NewTopic` bean via `TopicBuilder`, keyed by `orderId` for ordering guarantees per order.
- **Typed events** — `OrderPlaced` is a Java `record`; JSON deserialization is locked to trusted packages to avoid untrusted class instantiation.
- **Real-time UI** — the frontend subscribes to `/topic/orders` over SockJS and renders incoming orders live.

## Running locally

**Prerequisites:** Java 17+, Maven, Node.js 20+, Docker.

```bash
# 1. Start Kafka + Kafka UI
docker-compose up -d

# 2. Start the backend (http://localhost:8081)
cd backend
./mvnw spring-boot:run

# 3. Start the frontend (http://localhost:3000)
cd frontend
npm install
npm run dev
```

Kafka UI is available at `http://localhost:8085` for inspecting topics, partitions, and messages.

### Place an order

```bash
curl -X POST http://localhost:8081/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Sanele","product":"Mechanical Keyboard","quantity":1,"amount":1299.00}'
```

The order appears on the dashboard instantly.

## Tests

```bash
cd backend
./mvnw test
```

Covers the producer (`OrderServiceTest`), the consumer (`OrderConsumerTest`), and an end-to-end flow against an embedded Kafka broker (`OrderConsumerIntegrationTest`).

## Project structure

```
kafka-order-system/
├── backend/                 Spring Boot producer + consumer + WebSocket
│   └── src/main/java/com/sanele/kafkaorder/
│       ├── config/          Kafka topic, WebSocket (STOMP), CORS
│       ├── controller/      REST endpoint
│       ├── service/         Kafka producer (OrderService)
│       ├── consumer/        Kafka listener → WebSocket push
│       ├── event/           OrderPlaced domain event
│       └── dto/             Request/response records
├── frontend/                Next.js 16 real-time dashboard
└── docker-compose.yml       Kafka (KRaft) + Kafka UI
```
