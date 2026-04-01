import type { OrderStatus } from '../types/order';

export const ORDER_STATUS: Record<OrderStatus, string> = {
  1: 'Pending',
  2: 'Confirmed',
  3: 'Packed',
  4: 'Shipped',
  5: 'Delivered',
  6: 'Cancelled',
};
