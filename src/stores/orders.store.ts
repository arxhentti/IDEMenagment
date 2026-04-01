import { defineStore } from 'pinia';
import { ordersService } from '../services/orders.service';
import type { CreateOrderPayload, Order, OrderStatus, UpdateOrderStatusPayload } from '../types/order';

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  saving: boolean;
  error: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null) {
    const axiosLikeError = error as {
      response?: { data?: { message?: string }; statusText?: string };
      request?: unknown;
      message?: string;
    };

    if (axiosLikeError.response) {
      return axiosLikeError.response.data?.message || axiosLikeError.response.statusText || fallback;
    }

    if (axiosLikeError.request) {
      return 'Network error: backend may be unavailable.';
    }

    if (axiosLikeError.message) {
      return axiosLikeError.message;
    }
  }

  return fallback;
}

export const useOrdersStore = defineStore('orders', {
  state: (): OrdersState => ({
    orders: [],
    selectedOrder: null,
    loading: false,
    saving: false,
    error: '',
  }),
  actions: {
    async fetchOrders() {
      this.loading = true;
      this.error = '';

      try {
        this.orders = await ordersService.getAll();
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to load orders.');
      } finally {
        this.loading = false;
      }
    },
    async fetchOrderById(id: string) {
      this.loading = true;
      this.error = '';

      try {
        const order = await ordersService.getById(id);
        this.selectedOrder = order;
        this.orders = this.orders.some((item) => item.id === id)
          ? this.orders.map((item) => (item.id === id ? order : item))
          : [order, ...this.orders];
        return order;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to load order details.');
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async createOrder(payload: CreateOrderPayload) {
      this.saving = true;
      this.error = '';

      try {
        const order = await ordersService.create(payload);
        this.orders = [order, ...this.orders];
        return order;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to create order.');
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async updateOrderStatus(id: string, status: OrderStatus) {
      this.saving = true;
      this.error = '';

      try {
        const payload: UpdateOrderStatusPayload = { status };
        const updatedOrder = await ordersService.updateStatus(id, payload);
        this.orders = this.orders.map((order) => (order.id === id ? updatedOrder : order));

        if (this.selectedOrder?.id === id) {
          this.selectedOrder = updatedOrder;
        }

        return updatedOrder;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to update order status.');
        throw error;
      } finally {
        this.saving = false;
      }
    },
    clearSelectedOrder() {
      this.selectedOrder = null;
    },
  },
});
