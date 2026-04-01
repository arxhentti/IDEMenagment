<template>
  <div class="card">
    <div class="table-header">
      <div>
        <h3>Orders</h3>
        <p class="table-subtitle">Track status, totals, and fulfillment flow across every order.</p>
      </div>
      <BaseButton @click="$emit('create-order')" variant="primary">
        Create Order
      </BaseButton>
    </div>

    <div class="toolbar">
      <BaseInput v-model="searchQuery" placeholder="Search by order number, customer, or channel..." />
      <select v-model="statusFilter" class="status-select">
        <option value="all">All statuses</option>
        <option v-for="(label, key) in ORDER_STATUS" :key="key" :value="key">{{ label }}</option>
      </select>
    </div>

    <div v-if="ordersStore.loading" class="loading-state">
      <BaseLoader />
    </div>

    <div v-else-if="ordersStore.error" class="error-state">
      <p class="error-message">{{ ordersStore.error }}</p>
      <BaseButton @click="ordersStore.fetchOrders()" variant="secondary">
        Retry
      </BaseButton>
    </div>

    <div v-else-if="ordersStore.orders.length === 0" class="empty-state">
      <EmptyState
        title="No orders yet"
        description="Create your first order to start tracking fulfillment and revenue."
      >
        <BaseButton @click="$emit('create-order')" variant="primary">
          Create First Order
        </BaseButton>
      </EmptyState>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="empty-state">
      <EmptyState
        title="No orders match your filters"
        description="Try a different customer, channel, order number, or status."
      />
    </div>

    <div v-else class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Channel</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order.id">
            <td>
              <div class="order-meta">
                <strong>{{ order.orderNumber }}</strong>
                <span>{{ order.items.length }} items</span>
              </div>
            </td>
            <td>{{ order.customerName }}</td>
            <td>{{ formatCurrency(order.totalAmount) }}</td>
            <td>{{ order.sourceChannel || 'Manual' }}</td>
            <td><OrderStatusBadge :status="order.status" /></td>
            <td>{{ formatDate(order.createdAtUtc) }}</td>
            <td class="actions">
              <RouterLink class="details-link" :to="`/orders/${order.id}`">View</RouterLink>
              <select
                class="status-select"
                :value="order.status"
                @change="handleStatusChange(order.id, ($event.target as HTMLSelectElement).value)"
              >
                <option v-for="(label, key) in ORDER_STATUS" :key="key" :value="key">{{ label }}</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import EmptyState from '../../../components/feedback/EmptyState.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import { ORDER_STATUS } from '../../../constants/order-status';
import { useOrdersStore } from '../../../stores/orders.store';
import type { OrderStatus } from '../../../types/order';
import OrderStatusBadge from './OrderStatusBadge.vue';

const ordersStore = useOrdersStore();
const searchQuery = ref('');
const statusFilter = ref('all');

defineEmits<{
  'create-order': [];
}>();

onMounted(() => {
  if (ordersStore.orders.length === 0) {
    void ordersStore.fetchOrders();
  }
});

const filteredOrders = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return ordersStore.orders.filter((order) => {
    const matchesQuery =
      !query ||
      [order.orderNumber, order.customerName, order.sourceChannel]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    const matchesStatus = statusFilter.value === 'all' || String(order.status) === statusFilter.value;

    return matchesQuery && matchesStatus;
  });
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
  }).format(new Date(value));
}

async function handleStatusChange(orderId: string, rawValue: string) {
  const nextStatus = Number(rawValue) as OrderStatus;

  try {
    await ordersStore.updateOrderStatus(orderId, nextStatus);
  } catch {
    // Store error is rendered in the table state.
  }
}
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.table-header h3,
.table-subtitle {
  margin: 0;
}

.table-subtitle {
  margin-top: 0.25rem;
  color: var(--color-text-muted);
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 860px;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
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

.data-table tbody tr {
  border-bottom: 1px solid var(--color-border);
}

.data-table tbody tr td {
  border-bottom: 0;
}

.order-meta {
  display: grid;
  gap: 0.2rem;
}

.order-meta strong {
  color: var(--color-text);
  font-weight: 600;
}

.details-link {
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.status-select {
  min-width: 8.5rem;
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

.empty-state {
  text-align: center;
  padding: 2rem;
}

@media (max-width: 760px) {
  .table-header {
    flex-direction: column;
  }

  .toolbar {
    grid-template-columns: 1fr;
  }

  .actions {
    align-items: center;
    flex-direction: row;
  }
}
</style>
