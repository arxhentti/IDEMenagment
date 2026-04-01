import { http } from './http';
import type { CreateOrderPayload, Order, UpdateOrderStatusPayload } from '../types/order';

export const ordersService = {
  getAll: () => http.get<Order[]>('/orders').then((response) => response.data),
  getById: (id: string) => http.get<Order>(`/orders/${id}`).then((response) => response.data),
  create: (payload: CreateOrderPayload) => http.post<Order>('/orders', payload).then((response) => response.data),
  updateStatus: (id: string, payload: UpdateOrderStatusPayload) =>
    http.patch<Order>(`/orders/${id}/status`, payload).then((response) => response.data),
};
