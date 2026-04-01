<template>
  <span class="status-pill" :class="statusClass">
    {{ statusLabel }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ORDER_STATUS } from '../../../constants/order-status';
import type { OrderStatus } from '../../../types/order';

const props = defineProps<{
  status: OrderStatus;
}>();

const statusLabel = computed(() => ORDER_STATUS[props.status]);
const statusClass = computed(() => `status-pill--${props.status}`);
</script>

<style scoped>
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.72rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
}

.status-pill--1 {
  background: rgba(245, 158, 11, 0.14);
  color: #fcd34d;
}

.status-pill--2,
.status-pill--3 {
  background: rgba(37, 99, 235, 0.16);
  color: #93c5fd;
}

.status-pill--4 {
  background: rgba(168, 85, 247, 0.14);
  color: #d8b4fe;
}

.status-pill--5 {
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.status-pill--6 {
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
}
</style>
