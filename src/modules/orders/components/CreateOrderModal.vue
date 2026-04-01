<template>
  <BaseModal :open="isOpen" @close="handleClose">
    <div class="modal-card">
      <div class="modal-shell">
        <div class="modal-copy">
          <p class="modal-copy__eyebrow">Orders</p>
          <h2>Create a manual order</h2>
          <p class="modal-copy__text">
            Build a new order by selecting a customer, adding products, and setting the delivery details.
          </p>

          <div class="modal-copy__tags">
            <span>Customer</span>
            <span>Products</span>
            <span>Fulfillment</span>
          </div>
        </div>

        <div class="modal-form-wrap">
          <div class="modal-header">
            <div>
              <p class="modal-header__eyebrow">New Entry</p>
              <h3>Order Information</h3>
            </div>
            <BaseButton type="button" variant="secondary" @click="handleClose">
              Close
            </BaseButton>
          </div>

          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <label class="field field--full">
                <span>Customer</span>
                <select v-model="form.customerId" class="select">
                  <option value="">Select customer</option>
                  <option v-for="customer in customersStore.customers" :key="customer.id" :value="customer.id">
                    {{ customer.fullName }}
                  </option>
                </select>
              </label>

              <label class="field">
                <span>Source Channel</span>
                <BaseInput v-model="form.sourceChannel" placeholder="Instagram, WhatsApp, Website..." />
              </label>

              <label class="field">
                <span>Delivery Address</span>
                <BaseInput v-model="form.deliveryAddress" placeholder="Street, city, landmark..." />
              </label>

              <label class="field field--full">
                <span>Notes</span>
                <textarea
                  v-model="form.notes"
                  class="textarea"
                  rows="3"
                  placeholder="Order notes or special instructions"
                />
              </label>
            </div>

            <div class="items-block">
              <div class="items-block__header">
                <h4>Order Items</h4>
                <BaseButton type="button" variant="secondary" size="small" @click="addItem">
                  Add Item
                </BaseButton>
              </div>

              <div v-for="(item, index) in form.items" :key="index" class="item-row">
                <select v-model="item.productId" class="select">
                  <option value="">Select product</option>
                  <option v-for="product in activeProducts" :key="product.id" :value="product.id">
                    {{ product.name }}
                  </option>
                </select>

                <BaseInput v-model="item.quantity" type="number" placeholder="Qty" />

                <BaseButton
                  type="button"
                  variant="danger"
                  size="small"
                  :disabled="form.items.length === 1"
                  @click="removeItem(index)"
                >
                  Remove
                </BaseButton>
              </div>
            </div>

            <p v-if="validationError || ordersStore.error" class="error-message">
              {{ validationError || ordersStore.error }}
            </p>

            <div class="actions">
              <BaseButton type="button" variant="secondary" :disabled="ordersStore.saving" @click="handleClose">
                Cancel
              </BaseButton>
              <BaseButton type="submit" :loading="ordersStore.saving">
                Create Order
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
import { useCustomersStore } from '../../../stores/customers.store';
import { useOrdersStore } from '../../../stores/orders.store';
import { useProductsStore } from '../../../stores/products.store';
import type { CreateOrderPayload } from '../../../types/order';

interface OrderItemFormState {
  productId: string;
  quantity: string;
}

interface CreateOrderFormState {
  customerId: string;
  deliveryAddress: string;
  sourceChannel: string;
  notes: string;
  items: OrderItemFormState[];
}

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
  }>(),
  {
    isOpen: false,
  },
);

const emit = defineEmits(['close', 'saved']);

const ordersStore = useOrdersStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();

const form = reactive<CreateOrderFormState>({
  customerId: '',
  deliveryAddress: '',
  sourceChannel: '',
  notes: '',
  items: [{ productId: '', quantity: '1' }],
});

const validationError = ref('');

const activeProducts = computed(() => productsStore.products.filter((product) => product.isActive));

function resetForm() {
  form.customerId = '';
  form.deliveryAddress = '';
  form.sourceChannel = '';
  form.notes = '';
  form.items = [{ productId: '', quantity: '1' }];
  validationError.value = '';
}

function handleClose() {
  emit('close');
}

function addItem() {
  form.items.push({ productId: '', quantity: '1' });
}

function removeItem(index: number) {
  if (form.items.length > 1) {
    form.items.splice(index, 1);
  }
}

function buildPayload(): CreateOrderPayload {
  return {
    customerId: form.customerId,
    deliveryAddress: form.deliveryAddress.trim() || null,
    sourceChannel: form.sourceChannel.trim() || null,
    notes: form.notes.trim() || null,
    items: form.items.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    })),
  };
}

function validatePayload(payload: CreateOrderPayload) {
  if (!payload.customerId) {
    return 'Customer is required.';
  }

  if (payload.items.length === 0 || payload.items.some((item) => !item.productId || !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return 'Every order item needs a product and a valid quantity.';
  }

  return '';
}

async function loadDependencies() {
  if (customersStore.customers.length === 0) {
    await customersStore.fetchCustomers();
  }

  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts();
  }
}

async function handleSubmit() {
  const payload = buildPayload();
  const validationMessage = validatePayload(payload);

  if (validationMessage) {
    validationError.value = validationMessage;
    return;
  }

  validationError.value = '';

  try {
    const order = await ordersStore.createOrder(payload);
    emit('saved', order.id);
  } catch {
    // Store error is rendered in the template.
  }
}

watch(
  () => props.isOpen,
  async (isOpen) => {
    if (isOpen) {
      await loadDependencies();
      resetForm();
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
.modal-header h3,
.items-block__header h4 {
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

.modal-header,
.items-block__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.form,
.items-block {
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

.select,
.textarea {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: 0.85rem;
  padding: 0.85rem 0.95rem;
  box-sizing: border-box;
  background: rgba(15, 23, 42, 0.72);
  color: var(--color-text);
  font: inherit;
}

.textarea {
  resize: vertical;
  min-height: 100px;
}

.select:focus,
.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.16);
}

.item-row {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) 120px auto;
  gap: 0.75rem;
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
}

@media (max-width: 640px) {
  .modal-card {
    padding: 1rem;
  }

  .form-grid,
  .item-row {
    grid-template-columns: 1fr;
  }
}
</style>
