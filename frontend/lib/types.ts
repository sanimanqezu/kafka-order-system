export interface Finish {
  name: string;
  hex: string;
  screenTint: string;
}

export type Condition = "Pristine" | "Excellent" | "Good";

export interface IPhone {
  id: string;
  name: string;
  line: "Pro" | "Plus" | "Standard" | "SE";
  releaseYear: number;
  price: number;
  chip: string;
  display: string;
  camera: string;
  storage: string;
  condition: Condition;
  batteryHealth: number;
  finishes: Finish[];
  /** Optional photo in /public/products (e.g. "/products/iphone-15-pro.jpg"). Falls back to an SVG render. */
  image?: string;
}

export interface OrderStatusUpdate {
  orderId: string;
  customerName: string;
  product: string;
  status: string;
  updatedAt: string;
}

export type ConnectionState = "connecting" | "connected" | "disconnected" | "error";
