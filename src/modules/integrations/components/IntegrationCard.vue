<template>
  <article class="card integration-card">
    <div class="integration-card__header">
      <div>
        <p class="eyebrow">Integration</p>
        <h3>{{ integration.displayName }}</h3>
      </div>
      <span class="status-pill" :class="integration.isConnected ? 'status-pill--active' : 'status-pill--inactive'">
        {{ integration.isConnected ? 'Connected' : 'Disconnected' }}
      </span>
    </div>

    <div class="integration-card__meta">
      <p><strong>Provider:</strong> {{ integration.provider }}</p>
      <p><strong>Account:</strong> {{ integration.externalAccountId }}</p>
      <p>
        <strong>Last Sync:</strong>
        {{ integration.lastSyncAtUtc ? formatDate(integration.lastSyncAtUtc) : 'No sync recorded' }}
      </p>
    </div>

    <div class="integration-card__actions">
      <BaseButton
        variant="secondary"
        :loading="loading"
        @click="$emit('toggle', integration)"
      >
        {{ integration.isConnected ? 'Disconnect' : 'Connect' }}
      </BaseButton>
    </div>
  </article>
</template>

<script setup lang="ts">
import BaseButton from '../../../components/ui/BaseButton.vue';
import type { Integration } from '../../../types/integration';

defineProps<{
  integration: Integration;
  loading?: boolean;
}>();

defineEmits<{
  toggle: [integration: Integration];
}>();

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
</script>

<style scoped>
.integration-card {
  display: grid;
  gap: 1rem;
}

.integration-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.integration-card__header h3,
.integration-card__header p {
  margin: 0;
}

.integration-card__meta {
  display: grid;
  gap: 0.45rem;
  color: var(--color-text-muted);
}

.integration-card__meta p {
  margin: 0;
}

.integration-card__meta strong {
  color: var(--color-text);
  font-weight: 600;
}

.integration-card__actions {
  display: flex;
  justify-content: flex-end;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.38rem 0.72rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
}

.status-pill--active {
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.status-pill--inactive {
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
}
</style>
