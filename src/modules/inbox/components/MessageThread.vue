<template>
  <div class="card thread-card">
    <div v-if="!inboxStore.selectedConversation" class="thread-empty">
      <EmptyState
        title="Select a conversation"
        description="Choose a conversation from the left to view messages."
      />
    </div>

    <template v-else>
      <div class="thread-header">
        <div>
          <p class="eyebrow">Thread</p>
          <h3>{{ inboxStore.selectedConversation.customer?.fullName || 'Unknown customer' }}</h3>
        </div>
        <span class="thread-platform">{{ inboxStore.selectedConversation.platform }}</span>
      </div>

      <div v-if="inboxStore.loading && inboxStore.selectedMessages.length === 0" class="thread-loading">
        <BaseLoader />
      </div>

      <div v-else class="messages">
        <div
          v-for="message in inboxStore.selectedMessages"
          :key="message.id"
          class="message"
          :class="{ 'message--outgoing': message.isAutoReply || message.source === 4 }"
        >
          <p>{{ message.content }}</p>
          <span>{{ formatDate(message.createdAtUtc) }}</span>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import EmptyState from '../../../components/feedback/EmptyState.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import { useInboxStore } from '../../../stores/inbox.store';

const inboxStore = useInboxStore();

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}
</script>

<style scoped>
.thread-card {
  display: grid;
  gap: 1rem;
  min-height: 28rem;
}

.thread-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.thread-header h3,
.thread-header p {
  margin: 0;
}

.thread-platform {
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.14);
  color: var(--color-text);
  font-size: 0.84rem;
}

.messages {
  display: grid;
  gap: 0.75rem;
  align-content: start;
}

.message {
  max-width: 75%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem 1rem 1rem 0.35rem;
  background: rgba(15, 23, 42, 0.58);
}

.message--outgoing {
  margin-left: auto;
  border-radius: 1rem 1rem 0.35rem 1rem;
  background: rgba(37, 99, 235, 0.16);
}

.message p,
.message span {
  margin: 0;
}

.message span {
  display: block;
  margin-top: 0.45rem;
  color: var(--color-text-muted);
  font-size: 0.78rem;
}

.thread-empty,
.thread-loading {
  display: grid;
  place-items: center;
}
</style>
