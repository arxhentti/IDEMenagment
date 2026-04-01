<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Orders</p>
        <h1>Manage Orders</h1>
        <p class="muted">Monitor fulfillment, update statuses, and create new orders.</p>
      </div>
    </div>

    <OrderTable @create-order="showCreateModal = true" />

    <CreateOrderModal
      :is-open="showCreateModal"
      @close="showCreateModal = false"
      @saved="handleOrderSaved"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CreateOrderModal from '../components/CreateOrderModal.vue';
import OrderTable from '../components/OrderTable.vue';

const router = useRouter();
const showCreateModal = ref(false);

async function handleOrderSaved(orderId: string) {
  showCreateModal.value = false;
  await router.push(`/orders/${orderId}`);
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header > div {
  flex: 1;
}

.eyebrow {
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.page h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.muted {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
