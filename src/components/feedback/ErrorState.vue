<template>
  <section class="error-state">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h3>{{ title }}</h3>
    <p class="muted">{{ description }}</p>
    <div v-if="$slots.default" class="actions">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    eyebrow?: string;
  }>(),
  {
    title: 'Something went wrong',
    description: 'This view could not be loaded. Try again after checking the backend connection.',
    eyebrow: 'Error State',
  },
);
</script>

<style scoped>
.error-state {
  display: grid;
  gap: 0.75rem;
  justify-items: center;
}

.eyebrow {
  margin: 0;
  color: var(--color-error, #dc2626);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h3,
.muted {
  margin: 0;
}

.actions {
  margin-top: 0.5rem;
}
</style>
