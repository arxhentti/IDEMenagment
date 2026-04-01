<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Inbox</p>
        <h1>Manage Conversations</h1>
        <p class="muted">Review threads, reply to customers, and keep communication in one place.</p>
      </div>
    </div>

    <div class="inbox-grid">
      <ConversationList />
      <div class="inbox-main">
        <MessageThread />
        <ComposerBox />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import ConversationList from '../components/ConversationList.vue';
import ComposerBox from '../components/ComposerBox.vue';
import MessageThread from '../components/MessageThread.vue';
import { useInboxStore } from '../../../stores/inbox.store';

const inboxStore = useInboxStore();

onMounted(async () => {
  await inboxStore.fetchConversations();

  if (inboxStore.selectedConversationId) {
    await inboxStore.fetchMessages(inboxStore.selectedConversationId);
  }
});
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

.inbox-grid {
  display: grid;
  grid-template-columns: minmax(260px, 320px) minmax(0, 1fr);
  gap: 1rem;
}

.inbox-main {
  display: grid;
  gap: 1rem;
}

@media (max-width: 900px) {
  .inbox-grid {
    grid-template-columns: 1fr;
  }
}
</style>
