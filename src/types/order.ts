export type OrderStatus = 1 | 2 | 3 | 4 | 5 | 6;

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress?: string | null;
  sourceChannel?: string | null;
  createdAtUtc: string;
  items: OrderItem[];
}

export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  customerId: string;
  items: CreateOrderItemPayload[];
  deliveryAddress?: string | null;
  sourceChannel?: string | null;
  notes?: string | null;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
