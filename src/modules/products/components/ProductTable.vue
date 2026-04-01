<template>
  <div class="card">
    <div class="table-header">
      <div>
        <h3>Products</h3>
        <p class="table-subtitle">Keep your catalog, stock, and pricing synchronized.</p>
      </div>
      <BaseButton @click="$emit('create-product')" variant="primary">
        Add Product
      </BaseButton>
    </div>

    <div class="toolbar">
      <BaseInput v-model="searchQuery" placeholder="Search by product name or description..." />
      <select v-model="statusFilter" class="toolbar-select">
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    <div v-if="productsStore.loading" class="loading-state">
      <BaseLoader />
    </div>

    <div v-else-if="productsStore.error" class="error-state">
      <p class="error-message">{{ productsStore.error }}</p>
      <BaseButton @click="productsStore.fetchProducts()" variant="secondary">
        Retry
      </BaseButton>
    </div>

    <div v-else-if="productsStore.products.length === 0" class="empty-state">
      <EmptyState
        title="No products yet"
        description="Start by adding your first product to the catalog."
      >
        <BaseButton @click="$emit('create-product')" variant="primary">
          Add First Product
        </BaseButton>
      </EmptyState>
    </div>

    <div v-else-if="filteredProducts.length === 0" class="empty-state">
      <EmptyState
        title="No products match your filters"
        description="Try another search term or reset the status filter."
      />
    </div>

    <div v-else class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>
              <div class="product-meta">
                <strong>{{ product.name }}</strong>
                <span>{{ product.description || 'No description provided.' }}</span>
              </div>
            </td>
            <td>{{ formatCurrency(product.price) }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>
              <span class="status-pill" :class="product.isActive ? 'status-pill--active' : 'status-pill--inactive'">
                {{ product.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="actions">
              <BaseButton
                @click="$emit('edit-product', product)"
                variant="secondary"
                size="small"
              >
                Edit
              </BaseButton>
              <BaseButton
                @click="handleDelete(product.id)"
                variant="danger"
                size="small"
              >
                Delete
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import EmptyState from '../../../components/feedback/EmptyState.vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import { useProductsStore } from '../../../stores/products.store';
import type { Product } from '../../../types/product';

const productsStore = useProductsStore();
const searchQuery = ref('');
const statusFilter = ref<'all' | 'active' | 'inactive'>('all');

defineEmits<{
  'create-product': [];
  'edit-product': [product: Product];
}>();

onMounted(() => {
  if (productsStore.products.length === 0) {
    void productsStore.fetchProducts();
  }
});

const filteredProducts = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  return productsStore.products.filter((product) => {
    const matchesQuery =
      !query ||
      [product.name, product.description]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    const matchesStatus =
      statusFilter.value === 'all' ||
      (statusFilter.value === 'active' && product.isActive) ||
      (statusFilter.value === 'inactive' && !product.isActive);

    return matchesQuery && matchesStatus;
  });
});

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productsStore.deleteProduct(id);
    } catch {
      // Store error is rendered in the template.
    }
  }
}
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.table-header h3,
.table-subtitle {
  margin: 0;
}

.table-subtitle {
  margin-top: 0.25rem;
  color: var(--color-text-muted);
}

.toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 180px;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.toolbar-select {
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 0.65rem 0.8rem;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text);
  font: inherit;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
}

.error-message {
  color: var(--color-error);
  margin-bottom: 1rem;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table th,
.data-table td {
  padding: 0.9rem 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  font-weight: 600;
  background-color: rgba(30, 41, 59, 0.75);
  color: var(--color-text);
}

.data-table td {
  color: var(--color-text-muted);
}

.product-meta {
  display: grid;
  gap: 0.2rem;
}

.product-meta strong {
  color: var(--color-text);
  font-weight: 600;
}

.product-meta span {
  font-size: 0.92rem;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 500;
}

.status-pill--active {
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.status-pill--inactive {
  background: rgba(148, 163, 184, 0.14);
  color: #cbd5e1;
}

.actions {
  display: flex;
  gap: 0.5rem;
  border-bottom: 0;
}

.data-table tbody tr {
  border-bottom: 1px solid var(--color-border);
}

.data-table tbody tr:last-child {
  border-bottom: 0;
}

.data-table tbody tr td {
  border-bottom: 0;
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

@media (max-width: 760px) {
  .table-header {
    flex-direction: column;
  }

  .toolbar {
    grid-template-columns: 1fr;
  }

  .actions {
    flex-wrap: wrap;
  }
}
</style>
