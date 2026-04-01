<template>
  <div class="layout">
    <AppSidebar />
    <main class="app-main">
      <AppHeader />
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from './AppHeader.vue';
import AppSidebar from './AppSidebar.vue';
</script>

<style scoped>
.app-main {
  min-height: 100vh;
  background: transparent;
}
</style>
