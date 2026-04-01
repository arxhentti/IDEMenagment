<template>
  <BaseModal :open="isOpen" @close="handleClose">
    <div class="modal-card">
      <div class="modal-shell">
        <div class="modal-copy">
          <p class="modal-copy__eyebrow">Customers</p>
          <h2>{{ modalTitle }}</h2>
          <p class="modal-copy__text">
            {{
              isEditing
                ? 'Perditeso kontaktin dhe informacionin kryesor pa humbur ritmin e punes.'
                : 'Shto nje klient te ri me detajet kryesore qe te jete gati per porosi dhe komunikim.'
            }}
          </p>

          <div class="modal-copy__tags">
            <span>CRM</span>
            <span>Orders</span>
            <span>Inbox</span>
          </div>
        </div>

        <div class="modal-form-wrap">
          <div class="modal-header">
            <div>
              <p class="modal-header__eyebrow">{{ isEditing ? 'Edit Mode' : 'New Entry' }}</p>
              <h3>{{ isEditing ? 'Customer Details' : 'Customer Information' }}</h3>
            </div>
            <BaseButton type="button" variant="secondary" @click="handleClose">
              Close
            </BaseButton>
          </div>

          <form class="form" @submit.prevent="handleSubmit">
            <div class="form-grid">
              <label class="field field--full">
                <span>Full Name</span>
                <BaseInput v-model="form.fullName" placeholder="Customer full name" />
              </label>

              <label class="field">
                <span>Phone Number</span>
                <BaseInput v-model="form.phoneNumber" placeholder="+383 44 000 000" />
              </label>

              <label class="field">
                <span>WhatsApp</span>
                <BaseInput v-model="form.whatsAppNumber" placeholder="+383 44 000 000" />
              </label>

              <label class="field field--full">
                <span>Instagram Username</span>
                <BaseInput v-model="form.instagramUsername" placeholder="@username" />
              </label>

              <label class="field field--full">
                <span>Notes</span>
                <textarea
                  v-model="form.notes"
                  class="textarea"
                  rows="4"
                  placeholder="Add notes about preferences, delivery, or communication"
                />
              </label>
            </div>

            <p v-if="validationError || customersStore.error" class="error-message">
              {{ validationError || customersStore.error }}
            </p>

            <div class="actions">
              <BaseButton
                type="button"
                variant="secondary"
                :disabled="customersStore.saving"
                @click="handleClose"
              >
                Cancel
              </BaseButton>
              <BaseButton type="submit" :loading="customersStore.saving">
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
import { useCustomersStore } from '../../../stores/customers.store';
import type { Customer, CustomerPayload } from '../../../types/customer';

interface CustomerFormState {
  fullName: string;
  phoneNumber: string;
  instagramUsername: string;
  whatsAppNumber: string;
  notes: string;
}

const props = withDefaults(
  defineProps<{
    isOpen?: boolean;
    customer?: Customer | null;
  }>(),
  {
    isOpen: false,
    customer: null,
  },
);

const emit = defineEmits(['close', 'saved']);

const customersStore = useCustomersStore();
const validationError = ref('');

const form = reactive<CustomerFormState>({
  fullName: '',
  phoneNumber: '',
  instagramUsername: '',
  whatsAppNumber: '',
  notes: '',
});

const isEditing = computed(() => !!props.customer);
const modalTitle = computed(() => (isEditing.value ? 'Refine the customer profile' : 'Add a new customer'));
const submitLabel = computed(() => (isEditing.value ? 'Save Changes' : 'Create Customer'));

function syncForm() {
  form.fullName = props.customer?.fullName ?? '';
  form.phoneNumber = props.customer?.phoneNumber ?? '';
  form.instagramUsername = props.customer?.instagramUsername ?? '';
  form.whatsAppNumber = props.customer?.whatsAppNumber ?? '';
  form.notes = props.customer?.notes ?? '';
  validationError.value = '';
}

function handleClose() {
  emit('close');
}

function buildPayload(): CustomerPayload {
  return {
    fullName: form.fullName.trim(),
    phoneNumber: form.phoneNumber.trim(),
    instagramUsername: form.instagramUsername.trim() || null,
    whatsAppNumber: form.whatsAppNumber.trim() || null,
    notes: form.notes.trim() || null,
  };
}

async function handleSubmit() {
  const payload = buildPayload();

  if (!payload.fullName || !payload.phoneNumber) {
    validationError.value = 'Full name and phone number are required.';
    return;
  }

  validationError.value = '';

  try {
    if (props.customer) {
      await customersStore.updateCustomer(props.customer.id, payload);
    } else {
      await customersStore.createCustomer(payload);
    }

    emit('saved');
  } catch {
    // Store error is shown in the template.
  }
}

watch(
  () => props.customer,
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
