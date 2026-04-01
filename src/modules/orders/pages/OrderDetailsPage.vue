<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Orders</p>
        <h1>{{ order?.orderNumber || 'Order details' }}</h1>
        <p class="muted">Review order items, delivery details, and current fulfillment status.</p>
      </div>
      <RouterLink class="back-link" to="/orders">Back to Orders</RouterLink>
    </div>

    <div v-if="ordersStore.loading" class="card">
      <BaseLoader />
    </div>

    <div v-else-if="ordersStore.error" class="card page-section">
      <p class="eyebrow">Order Error</p>
      <h2>Order could not be loaded</h2>
      <p class="muted">{{ ordersStore.error }}</p>
    </div>

    <template v-else-if="order">
      <div class="page-grid">
        <div class="card page-section">
          <p class="eyebrow">Customer</p>
          <h2>{{ order.customerName }}</h2>
          <p class="muted">{{ order.deliveryAddress || 'No delivery address provided.' }}</p>
        </div>

        <div class="card page-section">
          <p class="eyebrow">Status</p>
          <OrderStatusBadge :status="order.status" />
          <p class="muted">Created {{ formatDate(order.createdAtUtc) }}</p>
        </div>

        <div class="card page-section">
          <p class="eyebrow">Channel</p>
          <h2>{{ order.sourceChannel || 'Manual' }}</h2>
          <p class="muted">Total {{ formatCurrency(order.totalAmount) }}</p>
        </div>
      </div>

      <div class="card page-section">
        <div class="details-header">
          <div>
            <p class="eyebrow">Items</p>
            <h2>Order Breakdown</h2>
          </div>

          <select class="status-select" :value="order.status" @change="handleStatusChange(($event.target as HTMLSelectElement).value)">
            <option v-for="(label, key) in ORDER_STATUS" :key="key" :value="key">{{ label }}</option>
          </select>
        </div>

        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.items" :key="`${order.id}-${item.productId}`">
              <td>{{ item.productName }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ formatCurrency(item.unitPrice) }}</td>
              <td>{{ formatCurrency(item.lineTotal) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import { ORDER_STATUS } from '../../../constants/order-status';
import { useOrdersStore } from '../../../stores/orders.store';
import type { OrderStatus } from '../../../types/order';
import OrderStatusBadge from '../components/OrderStatusBadge.vue';

const route = useRoute();
const ordersStore = useOrdersStore();
const order = computed(() => ordersStore.selectedOrder);

onMounted(async () => {
  await ordersStore.fetchOrderById(String(route.params.id));
});

onUnmounted(() => {
  ordersStore.clearSelectedOrder();
});

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

async function handleStatusChange(rawValue: string) {
  if (!order.value) {
    return;
  }

  try {
    await ordersStore.updateOrderStatus(order.value.id, Number(rawValue) as OrderStatus);
  } catch {
    // Store error is rendered on the page.
  }
}
</script>

<style scoped>
.page-header,
.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.page-header {
  margin-bottom: 2rem;
}

.back-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 0.9rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  font-weight: 600;
  background-color: rgba(30, 41, 59, 0.75);
  color: var(--color-text);
}

.data-table td {
  color: var(--color-text-muted);
}

.status-select {
  min-width: 10rem;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.55rem 0.7rem;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text);
  font: inherit;
}

.status-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.eyebrow {
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  margin: 0 0 0.5rem 0;
}

.page h1,
.page h2 {
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

.muted {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
