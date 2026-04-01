<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Integrations</p>
        <h1>Manage Integrations</h1>
        <p class="muted">Monitor connected accounts and control sync access from one place.</p>
      </div>
    </div>

    <div v-if="integrationsStore.loading" class="card loading-card">
      <BaseLoader />
    </div>

    <div v-else-if="integrationsStore.error" class="card error-card">
      <p class="error-message">{{ integrationsStore.error }}</p>
      <BaseButton @click="integrationsStore.fetchIntegrations()" variant="secondary">
        Retry
      </BaseButton>
    </div>

    <div v-else-if="integrationsStore.integrations.length === 0" class="card empty-card">
      <EmptyState
        title="No integrations found"
        description="Connected services will appear here once they are available."
      />
    </div>

    <div v-else class="integrations-grid">
      <IntegrationCard
        v-for="integration in integrationsStore.integrations"
        :key="integration.id"
        :integration="integration"
        :loading="integrationsStore.saving"
        @toggle="handleToggle"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import EmptyState from '../../../components/feedback/EmptyState.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import { useIntegrationsStore } from '../../../stores/integrations.store';
import type { Integration } from '../../../types/integration';
import IntegrationCard from '../components/IntegrationCard.vue';

const integrationsStore = useIntegrationsStore();

onMounted(() => {
  void integrationsStore.fetchIntegrations();
});

async function handleToggle(integration: Integration) {
  try {
    await integrationsStore.toggleIntegrationConnection(integration.id, !integration.isConnected);
  } catch {
    // Store error is rendered in the page state.
  }
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

.loading-card,
.error-card,
.empty-card {
  display: grid;
  place-items: center;
  gap: 1rem;
  min-height: 14rem;
}

.error-message {
  margin: 0;
  color: var(--color-error);
}

.integrations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
}
</style>
