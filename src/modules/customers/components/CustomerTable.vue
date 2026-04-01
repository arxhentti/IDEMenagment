<template>
  <div class="card">
    <div class="table-header">
      <div>
        <h3>Customers</h3>
        <p class="table-subtitle">Search by name, phone, Instagram, or WhatsApp.</p>
      </div>
      <BaseButton @click="$emit('create-customer')" variant="primary">
        Add Customer
      </BaseButton>
    </div>

    <div class="toolbar">
      <BaseInput v-model="searchQuery" placeholder="Search customers..." />
    </div>

    <div v-if="customersStore.loading" class="loading-state">
      <BaseLoader />
    </div>

    <div v-else-if="customersStore.error" class="error-state">
      <p class="error-message">{{ customersStore.error }}</p>
      <BaseButton @click="customersStore.fetchCustomers()" variant="secondary">
        Retry
      </BaseButton>
    </div>

    <div v-else-if="customersStore.customers.length === 0" class="empty-state">
      <EmptyState
        title="No customers yet"
        description="Start by adding your first customer to the system."
      >
        <BaseButton @click="$emit('create-customer')" variant="primary">
          Add First Customer
        </BaseButton>
      </EmptyState>
    </div>

    <div v-else-if="filteredCustomers.length === 0" class="empty-state">
      <EmptyState
        title="No customers match your search"
        description="Try another name, phone, or social handle."
      />
    </div>

    <div v-else class="table-scroll">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Instagram</th>
            <th>WhatsApp</th>
            <th>Orders</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.id">
            <td>{{ customer.fullName }}</td>
            <td>{{ customer.phoneNumber }}</td>
            <td>{{ customer.instagramUsername || '-' }}</td>
            <td>{{ customer.whatsAppNumber || '-' }}</td>
            <td>{{ customer.ordersCount }}</td>
            <td class="actions">
              <BaseButton
                @click="$emit('edit-customer', customer)"
                variant="secondary"
                size="small"
              >
                Edit
              </BaseButton>
              <BaseButton
                @click="handleDelete(customer.id)"
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
import BaseButton from '../../../components/ui/BaseButton.vue';
import BaseInput from '../../../components/ui/BaseInput.vue';
import BaseLoader from '../../../components/ui/BaseLoader.vue';
import EmptyState from '../../../components/feedback/EmptyState.vue';
import { useCustomersStore } from '../../../stores/customers.store';
import type { Customer } from '../../../types/customer';

const customersStore = useCustomersStore();
const searchQuery = ref('');

const emit = defineEmits<{
  'create-customer': [];
  'edit-customer': [customer: Customer];
}>();

onMounted(() => {
  if (customersStore.customers.length === 0) {
    void customersStore.fetchCustomers();
  }
});

const filteredCustomers = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();

  if (!query) {
    return customersStore.customers;
  }

  return customersStore.customers.filter((customer) =>
    [customer.fullName, customer.phoneNumber, customer.instagramUsername, customer.whatsAppNumber]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query)),
  );
});

const handleDelete = async (id: string) => {
  if (confirm('Are you sure you want to delete this customer?')) {
    try {
      await customersStore.deleteCustomer(id);
    } catch (error) {
      // Error is handled in the store
    }
  }
};
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
  margin-bottom: 1rem;
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
  min-width: 760px;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table th,
.data-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  font-weight: 600;
  background-color: rgba(30, 41, 59, 0.75);
  color: var(--color-text);
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.empty-state {
  text-align: center;
  padding: 2rem;
}

.data-table td {
  color: var(--color-text-muted);
}

@media (max-width: 760px) {
  .table-header {
    flex-direction: column;
  }

  .actions {
    flex-wrap: wrap;
  }
}
</style>
