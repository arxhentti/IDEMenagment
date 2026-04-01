<template>
  <div class="card composer-card">
    <div class="composer-header">
      <p class="eyebrow">Reply</p>
      <p class="composer-note">Send a quick response to the selected conversation.</p>
    </div>

    <div v-if="!inboxStore.selectedConversation" class="composer-disabled">
      Select a conversation to send a message.
    </div>

    <form v-else class="composer-form" @submit.prevent="handleSubmit">
      <textarea
        v-model="content"
        class="composer-textarea"
        rows="4"
        placeholder="Write your message..."
      />

      <p v-if="errorMessage || inboxStore.error" class="composer-error">
        {{ errorMessage || inboxStore.error }}
      </p>

      <div class="composer-actions">
        <BaseButton type="submit" :loading="inboxStore.sending">
          Send Message
        </BaseButton>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import { useInboxStore } from '../../../stores/inbox.store';

const inboxStore = useInboxStore();
const content = ref('');
const errorMessage = ref('');

async function handleSubmit() {
  if (!inboxStore.selectedConversation) {
    return;
  }

  if (!content.value.trim()) {
    errorMessage.value = 'Message content is required.';
    return;
  }

  errorMessage.value = '';

  try {
    await inboxStore.sendMessage({
      conversationId: inboxStore.selectedConversation.id,
      content: content.value.trim(),
      source: 4,
      isAutoReply: false,
    });
    content.value = '';
  } catch {
    // Store error is shown above.
  }
}
</script>

<style scoped>
.composer-card {
  display: grid;
  gap: 1rem;
}

.composer-header {
  display: grid;
  gap: 0.25rem;
}

.composer-header p {
  margin: 0;
}

.composer-note,
.composer-disabled {
  color: var(--color-text-muted);
}

.composer-form {
  display: grid;
  gap: 0.9rem;
}

.composer-textarea {
  width: 100%;
  min-height: 7rem;
  resize: vertical;
  border: 1px solid var(--color-border);
  border-radius: 0.85rem;
  padding: 0.85rem 0.95rem;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text);
  font: inherit;
}

.composer-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.16);
}

.composer-error {
  margin: 0;
  color: var(--color-error);
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
}
</style>
