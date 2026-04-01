<template>
  <header class="header">
    <div>
      <p class="header__eyebrow">OrderFlow</p>
      <h3>Workspace</h3>
    </div>

    <div class="header__actions">
      <span class="header__status">Online</span>
      <BaseButton variant="secondary" size="small" @click="handleLogout">
        Logout
      </BaseButton>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import BaseButton from '../ui/BaseButton.vue';
import { useAuthStore } from '../../stores/auth.store';

const auth = useAuthStore();
const router = useRouter();

async function handleLogout() {
  auth.logout();
  await router.push('/login');
}
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(15, 23, 42, 0.72);
  border-bottom: 1px solid var(--color-border);
}

.header h3,
.header__eyebrow {
  margin: 0;
}

.header__eyebrow {
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header h3 {
  font-weight: 600;
  letter-spacing: -0.01em;
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header__status {
  color: var(--color-text-muted);
  font-size: 0.875rem;
}

@media (max-width: 640px) {
  .header {
    align-items: flex-start;
    flex-direction: column;
  }

  .header__actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
