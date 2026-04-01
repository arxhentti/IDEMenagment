<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Products</p>
        <h1>Manage Product Catalog</h1>
        <p class="muted">Control pricing, stock, and active products from one workspace.</p>
      </div>
    </div>

    <ProductTable
      @create-product="showCreateModal = true"
      @edit-product="handleEditProduct"
    />

    <ProductFormModal
      :is-open="showCreateModal || showEditModal"
      :product="selectedProduct"
      @close="closeModals"
      @saved="handleProductSaved"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ProductFormModal from '../components/ProductFormModal.vue';
import ProductTable from '../components/ProductTable.vue';
import type { Product } from '../../../types/product';

const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedProduct = ref<Product | null>(null);

function handleEditProduct(product: Product) {
  selectedProduct.value = product;
  showEditModal.value = true;
}

function closeModals() {
  showCreateModal.value = false;
  showEditModal.value = false;
  selectedProduct.value = null;
}

function handleProductSaved() {
  closeModals();
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header > div {
  flex: 1;
}

.eyebrow {
  color: var(--color-primary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.page h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 600;
}

.muted {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
