<template>
  <button
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`]"
    :type="type"
    :disabled="disabled || loading"
  >
    <slot v-if="!loading" />
    <span v-else>Processing...</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium';
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    type: 'button',
    variant: 'primary',
    size: 'medium',
    disabled: false,
    loading: false,
  },
);
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 0.75rem;
  font: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}

.btn--medium {
  min-height: 2.5rem;
  padding: 0.65rem 1rem;
}

.btn--small {
  min-height: 2rem;
  padding: 0.45rem 0.75rem;
  font-size: 0.875rem;
}

.btn--primary {
  background: #2563eb;
  color: #ffffff;
}

.btn--secondary {
  background: #ffffff;
  color: #111827;
  border-color: #d1d5db;
}

.btn--danger {
  background: #dc2626;
  color: #ffffff;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
