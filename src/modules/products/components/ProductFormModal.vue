<template>
  <BaseModal :open="isOpen" @close="handleClose">
    <div class="modal-card">
      <div class="modal-shell">
        <div class="modal-copy">
          <p class="modal-copy__eyebrow">Products</p>
          <h2>{{ modalTitle }}</h2>
          <p class="modal-copy__text">
            {{
              isEditing
                ? 'Update stock, visibility, and pricing without leaving the workspace.'
                : 'Add a new product with the core details needed for catalog and order flow.'
            }}
          </p>

          <div class="modal-copy__tags">
            <span>Catalog</span>
            <span>Stock</span>
            <span>Pricing</span>
          </div>
        </div>

        <div class="modal-form-wrap">
          <div class="modal-header">
            <div>
              <p class="modal-header__eyebrow">{{ isEditing ? 'Edit Mode' : 'New Entry' }}</p>
              <h3>{{ isEditing ? 'Product Details' : 'Product Information' }}</h3>
            </div>
            <BaseButton type="button" variant="secondary" @click="handleClose">
              Close
            </BaseButton>
          </div>

          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <label class="field field--full">
                <span>Product Name</span>
                <BaseInput v-model="form.name" placeholder="Premium Hoodie" />
              </label>

              <label class="field">
                <span>Price</span>
                <BaseInput v-model="form.price" type="number" placeholder="0.00" />
              </label>

              <label class="field">
                <span>Stock Quantity</span>
                <BaseInput v-model="form.stockQuantity" type="number" placeholder="0" />
              </label>

              <label class="field field--full">
                <span>Description</span>
                <textarea
                  v-model="form.description"
                  class="textarea"
                  rows="4"
                  placeholder="Short description for the product catalog"
                />
              </label>

              <label v-if="isEditing" class="field field--full toggle-field">
                <span>Status</span>
                <button
                  type="button"
                  class="toggle"
                  :class="{ 'toggle--active': form.isActive }"
                  @click="form.isActive = !form.isActive"
                >
                  <span class="toggle__dot" />
                  <span>{{ form.isActive ? 'Active product' : 'Inactive product' }}</span>
                </button>
              </label>
            </div>

            <p v-if="validationError || productsStore.error" class="error-message">
              {{ validationError || productsStore.error }}
            </p>

            <div class="actions">
              <BaseButton
                type="button"
                variant="secondary"
                :disabled="productsStore.saving"
                @click="handleClose"
              >
                Cancel
              </BaseButton>
              <BaseButton type="submit" :loading="productsStore.saving">
                {{ submitLabel }}
              </BaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseModal from '../../../components/ui/BaseModal.vue';
import { useProductsStore } from '../../../stores/products.store';
import type { Product, ProductPayload, UpdateProductPayload } from '../../../types/product';

interface ProductFormState {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  isActive: boolean;
}

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    product?: Product | null;
  }>(),
  {
    isOpen: false,
    product: null,
  },
);

const emit = defineEmits(['close', 'saved']);

const productsStore = useProductsStore();
const validationError = ref('');

const form = reactive<ProductFormState>({
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  isActive: true,
});

const isEditing = computed(() => !!props.product);
const modalTitle = computed(() => (isEditing.value ? 'Refine the product profile' : 'Add a new product'));
const submitLabel = computed(() => (isEditing.value ? 'Save Changes' : 'Create Product'));

function syncForm() {
  form.name = props.product?.name ?? '';
  form.description = props.product?.description ?? '';
  form.price = props.product ? String(props.product.price) : '';
  form.stockQuantity = props.product ? String(props.product.stockQuantity) : '';
  form.isActive = props.product?.isActive ?? true;
  validationError.value = '';
}

function handleClose() {
  emit('close');
}

function buildCreatePayload(): ProductPayload {
  return {
    name: form.name.trim(),
    description: form.description.trim() || null,
    price: Number(form.price),
    stockQuantity: Number(form.stockQuantity),
  };
}

function buildUpdatePayload(): UpdateProductPayload {
  return {
    ...buildCreatePayload(),
    isActive: form.isActive,
  };
}

function validatePayload(payload: ProductPayload) {
  if (!payload.name) {
    return 'Product name is required.';
  }

  if (Number.isNaN(payload.price) || payload.price < 0) {
    return 'Price must be a valid number.';
  }

  if (!Number.isInteger(payload.stockQuantity) || payload.stockQuantity < 0) {
    return 'Stock quantity must be a whole number.';
  }

  return '';
}

async function handleSubmit() {
  const payload = buildCreatePayload();
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    validationError.value = validationMessage;
    return;
  }

  validationError.value = '';

  try {
    if (props.product) {
      await productsStore.updateProduct(props.product.id, buildUpdatePayload());
    } else {
      await productsStore.createProduct(payload);
    }

    emit('saved');
  } catch {
    // Store error is shown in the template.
  }
}

watch(
  () => props.product,
  () => {
    syncForm();
  },
  { immediate: true },
);

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      syncForm();
    }
  },
);
</script>

<style scoped>
.modal-card {
  padding: 1.5rem;
}

.modal-shell {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 1.2fr);
  gap: 1.5rem;
}

.modal-copy {
  display: grid;
  align-content: start;
  gap: 0.8rem;
  padding: 1.1rem;
  border: 1px solid rgba(148, 163, 184, 0.14);
  border-radius: 1.25rem;
  background: rgba(2, 6, 23, 0.28);
}

.modal-copy__eyebrow,
.modal-header__eyebrow {
  margin: 0;
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.modal-copy h2,
.modal-header h3 {
  margin: 0;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.modal-copy__text {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.65;
}

.modal-copy__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}

.modal-copy__tags span {
  padding: 0.45rem 0.75rem;
  border: 1px solid rgba(96, 165, 250, 0.18);
  border-radius: 999px;
  background: rgba(37, 99, 235, 0.12);
  color: var(--color-text);
  font-size: 0.84rem;
}

.modal-form-wrap {
  display: grid;
  gap: 1.2rem;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.form {
  display: grid;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.field {
  display: grid;
  gap: 0.45rem;
}

.field--full {
  grid-column: 1 / -1;
}

.field span {
  color: #cbd5e1;
  font-size: 0.84rem;
  font-weight: 500;
}

.textarea {
  width: 100%;
  resize: vertical;
  min-height: 120px;
  border: 1px solid var(--color-border);
  border-radius: 0.85rem;
  padding: 0.85rem 0.95rem;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text);
  font: inherit;
}

.textarea::placeholder {
  color: #64748b;
}

.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.16);
}

.toggle-field {
  gap: 0.65rem;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.7rem;
  width: fit-content;
  padding: 0.55rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text-muted);
  cursor: pointer;
  font: inherit;
}

.toggle--active {
  border-color: rgba(34, 197, 94, 0.32);
  color: #dcfce7;
}

.toggle__dot {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 999px;
  background: #64748b;
}

.toggle--active .toggle__dot {
  background: #22c55e;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.error-message {
  margin: 0;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 0.9rem;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 0.92rem;
}

@media (max-width: 900px) {
  .modal-shell {
    grid-template-columns: 1fr;
  }

  .modal-copy {
    padding: 1rem;
  }
}

@media (max-width: 640px) {
  .modal-card {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
