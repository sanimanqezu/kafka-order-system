import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

const client = axios.create({ baseURL: API_URL });

export interface PlaceOrderRequest {
  customerName: string;
  product: string;
  quantity: number;
  amount: number;
}

export interface OrderResponse {
  orderId: string;
  status: string;
  message: string;
}

export async function placeOrder(request: PlaceOrderRequest): Promise<OrderResponse> {
  const { data } = await client.post<OrderResponse>("/api/orders", request);
  return data;
}
