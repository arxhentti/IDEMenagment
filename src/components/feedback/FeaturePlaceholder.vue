<template>
  <section class="card page-section">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2>{{ title }}</h2>
    <p class="muted">{{ description }}</p>
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
    eyebrow: 'Coming Soon',
  },
);
</script>
