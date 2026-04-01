<template>
  <section class="empty-state">
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
    title: string;
    description: string;
    eyebrow?: string;
  }>(),
  {
    eyebrow: 'Empty State',
  },
);
</script>

<style scoped>
.empty-state {
  display: grid;
  gap: 0.75rem;
  justify-items: center;
}

.eyebrow {
  margin: 0;
  color: var(--color-primary);
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
