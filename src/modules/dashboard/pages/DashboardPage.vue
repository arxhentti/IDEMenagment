<template>
  <section class="page">
    <div class="card hero-card">
      <div>
        <p class="eyebrow">Dashboard</p>
        <h1>OrderFlow workspace</h1>
        <p class="muted">Monitor the health of customers, products, orders, and communication from one place.</p>
      </div>

      <div class="hero-actions">
        <RouterLink class="hero-link" to="/customers">Customers</RouterLink>
        <RouterLink class="hero-link" to="/orders">Orders</RouterLink>
        <RouterLink class="hero-link" to="/products">Products</RouterLink>
      </div>

      <div class="hero-actions-mobile">
        <label class="hero-actions-mobile__label" for="workspace-nav">Quick navigation</label>
        <select id="workspace-nav" class="hero-actions-mobile__select" @change="handleQuickNavigation">
          <option value="">Choose section</option>
          <option value="/customers">Customers</option>
          <option value="/orders">Orders</option>
          <option value="/products">Products</option>
        </select>
      </div>
    </div>

    <div v-if="dashboard.loading" class="card">
      <BaseLoader />
    </div>

    <div v-else-if="dashboard.error" class="card page-section">
      <p class="eyebrow">API Error</p>
      <h2>Dashboard could not be loaded</h2>
      <p class="muted">{{ dashboard.error }}</p>
    </div>

    <template v-else-if="dashboard.stats">
      <div class="page-grid metrics-grid">
        <div class="card stat-card">
          <p class="eyebrow">Customers</p>
          <h2>{{ dashboard.stats.totalCustomers }}</h2>
          <p class="muted">People currently stored in your CRM.</p>
        </div>
        <div class="card stat-card">
          <p class="eyebrow">Products</p>
          <h2>{{ dashboard.stats.totalProducts }}</h2>
          <p class="muted">Items currently available in the catalog.</p>
        </div>
        <div class="card stat-card">
          <p class="eyebrow">Orders</p>
          <h2>{{ dashboard.stats.totalOrders }}</h2>
          <p class="muted">Total orders processed in the workspace.</p>
        </div>
        <div class="card stat-card">
          <p class="eyebrow">Open Conversations</p>
          <h2>{{ dashboard.stats.openConversations }}</h2>
          <p class="muted">Threads still waiting for action or follow-up.</p>
        </div>
      </div>

      <div class="page-grid secondary-grid">
        <div class="card page-section">
          <p class="eyebrow">Revenue This Month</p>
          <h2>{{ formatCurrency(dashboard.stats.revenueThisMonth) }}</h2>
          <p class="muted">Live snapshot of current monthly revenue.</p>
        </div>

        <div class="card page-section">
          <p class="eyebrow">Pending Orders</p>
          <h2>{{ dashboard.stats.ordersPending }}</h2>
          <p class="muted">Orders that still need packing, shipping, or delivery action.</p>
        </div>

        <div class="card page-section">
          <p class="eyebrow">Recommended Focus</p>
          <h2>{{ recommendedFocus.title }}</h2>
          <p class="muted">{{ recommendedFocus.description }}</p>
        </div>
      </div>

      <div class="page-grid overview-grid">
        <div class="card page-section">
          <div class="section-header">
            <div>
              <p class="eyebrow">Orders By Channel</p>
              <h2>Channel Overview</h2>
            </div>
          </div>

          <div v-if="dashboard.stats.ordersByChannel.length" class="channel-list">
            <div
              v-for="item in dashboard.stats.ordersByChannel"
              :key="item.channel"
              class="channel-row"
            >
              <span>{{ item.channel }}</span>
              <div class="channel-row__value">
                <div class="channel-bar">
                  <div class="channel-bar__fill" :style="{ width: `${getChannelWidth(item.count)}%` }" />
                </div>
                <strong>{{ item.count }}</strong>
              </div>
            </div>
          </div>
          <p v-else class="muted">No channel data available yet.</p>
        </div>

        <div class="card page-section">
          <p class="eyebrow">Quick Actions</p>
          <h2>Go Faster</h2>
          <div class="quick-links">
            <RouterLink class="quick-link" to="/customers">Add or edit customers</RouterLink>
            <RouterLink class="quick-link" to="/products">Update pricing and stock</RouterLink>
            <RouterLink class="quick-link" to="/orders">Create and update orders</RouterLink>
            <RouterLink class="quick-link" to="/inbox">Reply to conversations</RouterLink>
          </div>
        </div>
      </div>

      <div class="card page-section">
        <p class="eyebrow">Recent Activity</p>
        <h2>Suggested Operational View</h2>
        <div class="activity-list">
          <div class="activity-item">
            <strong>{{ dashboard.stats.ordersPending }} pending orders</strong>
            <span>Review fulfillment queue and update priority items first.</span>
          </div>
          <div class="activity-item">
            <strong>{{ dashboard.stats.openConversations }} open conversations</strong>
            <span>Keep inbox clear so active customers do not wait too long.</span>
          </div>
          <div class="activity-item">
            <strong>{{ topChannelLabel }}</strong>
            <span>{{ topChannelDescription }}</span>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import { useAuthStore } from '../../../stores/auth.store';
import { useDashboardStore } from '../../../stores/dashboard.store';

const dashboard = useDashboardStore();
const auth = useAuthStore();
const router = useRouter();

const topChannel = computed(() => {
  if (!dashboard.stats?.ordersByChannel.length) {
    return null;
  }

  return [...dashboard.stats.ordersByChannel].sort((a, b) => b.count - a.count)[0];
});

const recommendedFocus = computed(() => {
  if (!dashboard.stats) {
    return {
      title: 'Workspace overview',
      description: 'Load dashboard statistics to see the current operational priority.',
    };
  }

  if (dashboard.stats.ordersPending > 0) {
    return {
      title: 'Fulfillment queue',
      description: 'Pending orders are your top priority right now. Clear them to keep delivery flow moving.',
    };
  }

  if (dashboard.stats.openConversations > 0) {
    return {
      title: 'Inbox follow-up',
      description: 'There are active conversations waiting for replies. A quick response can unlock the next order.',
    };
  }

  return {
    title: 'Catalog maintenance',
    description: 'Core operations look healthy. This is a good time to refine products and update stock.',
  };
});

const topChannelLabel = computed(() =>
  topChannel.value ? `${topChannel.value.channel} is leading with ${topChannel.value.count} orders` : 'No active order channel yet',
);

const topChannelDescription = computed(() =>
  topChannel.value
    ? 'This channel is currently driving the strongest order volume in your workspace.'
    : 'Once orders start flowing through channels, the strongest one will appear here.',
);

onMounted(() => {
  if (!auth.isAuthenticated) {
    dashboard.error = 'You must be logged in to view dashboard data.';
    return;
  }

  void dashboard.fetchStats();
});

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

function getChannelWidth(count: number) {
  const highest = topChannel.value?.count || 1;
  return Math.max((count / highest) * 100, 8);
}

function handleQuickNavigation(event: Event) {
  const target = event.target as HTMLSelectElement | null;
  const value = target?.value;

  if (value) {
    void router.push(value);
    target.value = '';
  }
}
</script>

<style scoped>
.hero-card,
.section-header,
.channel-row,
.channel-row__value {
  display: flex;
  align-items: center;
}

.hero-card,
.section-header {
  justify-content: space-between;
}

.hero-card {
  gap: 1.5rem;
}

.hero-actions,
.quick-links,
.activity-list {
  display: grid;
  gap: 0.75rem;
}

.hero-actions-mobile {
  display: none;
  gap: 0.45rem;
}

.hero-link,
.quick-link {
  color: var(--color-text);
  text-decoration: none;
  padding: 0.75rem 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: 0.9rem;
  background: rgba(15, 23, 42, 0.42);
}

.hero-actions-mobile__label {
  color: var(--color-text-muted);
  font-size: 0.86rem;
}

.hero-actions-mobile__select {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.85rem;
  padding: 0.75rem 0.9rem;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text);
  font: inherit;
}

.metrics-grid {
  margin-top: 1rem;
}

.stat-card h2,
.page-section h2 {
  margin: 0;
}

.secondary-grid,
.overview-grid {
  margin-top: 1rem;
}

.channel-list {
  display: grid;
  gap: 0.9rem;
}

.channel-row {
  justify-content: space-between;
  gap: 1rem;
}

.channel-row__value {
  gap: 0.75rem;
  min-width: min(100%, 14rem);
}

.channel-bar {
  flex: 1;
  height: 0.5rem;
  background: rgba(148, 163, 184, 0.14);
  border-radius: 999px;
  overflow: hidden;
}

.channel-bar__fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(37, 99, 235, 0.92), rgba(125, 211, 252, 0.95));
}

.activity-item {
  display: grid;
  gap: 0.25rem;
  padding: 0.95rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  background: rgba(15, 23, 42, 0.38);
}

.activity-item strong {
  color: var(--color-text);
  font-weight: 600;
}

.activity-item span {
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .hero-card,
  .section-header,
  .channel-row {
    align-items: flex-start;
    flex-direction: column;
  }

  .hero-actions {
    display: none;
  }

  .hero-actions-mobile {
    display: grid;
    width: 100%;
  }
}
</style>
