<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <p class="sidebar__eyebrow">OrderFlow</p>
      <strong>Operations</strong>
    </div>

    <div class="sidebar__mobile-nav">
      <label class="sidebar__mobile-label" for="mobile-navigation">Quick navigation</label>
      <select id="mobile-navigation" class="sidebar__mobile-select" @change="handleNavigation">
        <option value="">Choose section</option>
        <option value="/">Dashboard</option>
        <option value="/customers">Customers</option>
        <option value="/products">Products</option>
        <option value="/orders">Orders</option>
        <option value="/inbox">Inbox</option>
        <option value="/integrations">Integrations</option>
      </select>
    </div>

    <nav class="sidebar__nav">
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/customers">Customers</RouterLink>
      <RouterLink to="/products">Products</RouterLink>
      <RouterLink to="/orders">Orders</RouterLink>
      <RouterLink to="/inbox">Inbox</RouterLink>
      <RouterLink to="/integrations">Integrations</RouterLink>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function handleNavigation(event: Event) {
  const target = event.target as HTMLSelectElement | null;
  const value = target?.value;

  if (value) {
    void router.push(value);
    target.value = '';
  }
}
</script>

<style scoped>
.sidebar__brand {
  display: grid;
  gap: 0.2rem;
  padding: 0.6rem 0.75rem 1rem;
}

.sidebar__brand strong,
.sidebar__eyebrow {
  margin: 0;
}

.sidebar__eyebrow {
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sidebar__brand strong {
  color: var(--color-text);
  font-size: 1.15rem;
  font-weight: 600;
}

.sidebar__nav {
  display: grid;
  gap: 0.25rem;
}

.sidebar__mobile-nav {
  display: none;
  gap: 0.45rem;
}

.sidebar__mobile-label {
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.sidebar__mobile-select {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.85rem;
  padding: 0.75rem 0.9rem;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text);
  font: inherit;
}

@media (max-width: 980px) {
  .sidebar {
    display: grid;
    gap: 0.75rem;
  }

  .sidebar__brand {
    padding-bottom: 0;
  }

  .sidebar__mobile-nav {
    display: grid;
  }

  .sidebar__nav {
    display: none;
  }
}
</style>
