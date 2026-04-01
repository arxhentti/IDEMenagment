<template>
  <div v-if="open" class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-panel">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  open: boolean;
}>();

defineEmits<{
  close: [];
}>();
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(2, 6, 23, 0.72);
  backdrop-filter: blur(10px);
}

.modal-panel {
  width: min(100%, 40rem);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1.5rem;
  box-shadow: var(--shadow-panel);
  backdrop-filter: blur(18px);
}
</style>
