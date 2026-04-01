<template>
  <div class="card list-card">
    <div class="list-header">
      <p class="eyebrow">Inbox</p>
      <h3>Conversations</h3>
    </div>

    <div v-if="inboxStore.loading && inboxStore.conversations.length === 0" class="loading-state">
      <BaseLoader />
    </div>

    <div v-else-if="inboxStore.conversations.length === 0" class="empty-state">
      <EmptyState
        title="No conversations yet"
        description="When customers start messaging, they will appear here."
      />
    </div>

    <button
      v-for="conversation in inboxStore.conversations"
      :key="conversation.id"
      type="button"
      class="conversation-item"
      :class="{ 'conversation-item--active': conversation.id === inboxStore.selectedConversationId }"
      @click="inboxStore.selectConversation(conversation.id)"
    >
      <div class="conversation-item__top">
        <strong>{{ conversation.customer?.fullName || 'Unknown customer' }}</strong>
        <span>{{ conversation.platform }}</span>
      </div>
      <p>{{ conversation.customer?.phoneNumber || conversation.externalThreadId }}</p>
    </button>
  </div>
</template>

<script setup lang="ts">
import EmptyState from '../../../components/feedback/EmptyState.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import { useInboxStore } from '../../../stores/inbox.store';

const inboxStore = useInboxStore();
</script>

<style scoped>
.list-card {
  display: grid;
  gap: 0.9rem;
}

.list-header {
  display: grid;
  gap: 0.25rem;
}

.list-header h3,
.list-header p {
  margin: 0;
}

.conversation-item {
  display: grid;
  gap: 0.35rem;
  padding: 0.9rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.5);
  color: var(--color-text-muted);
  text-align: left;
  cursor: pointer;
}

.conversation-item--active {
  border-color: rgba(96, 165, 250, 0.28);
  background: rgba(37, 99, 235, 0.14);
}

.conversation-item__top {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}

.conversation-item__top strong {
  color: var(--color-text);
  font-weight: 600;
}

.conversation-item p,
.conversation-item span {
  margin: 0;
}

.loading-state,
.empty-state {
  padding: 1rem 0;
}
</style>
