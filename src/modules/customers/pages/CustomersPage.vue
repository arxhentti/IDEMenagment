<template>
  <section class="page">
    <div class="page-header">
      <div>
        <p class="eyebrow">Customers</p>
        <h1>Manage Customers</h1>
        <p class="muted">View and manage your customer database.</p>
      </div>
    </div>

    <CustomerTable
      @create-customer="showCreateModal = true"
      @edit-customer="handleEditCustomer"
    />

    <CustomerFormModal
      :is-open="showCreateModal || showEditModal"
      :customer="selectedCustomer"
      @close="closeModals"
      @saved="handleCustomerSaved"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CustomerTable from '../components/CustomerTable.vue';
import CustomerFormModal from '../components/CustomerFormModal.vue';
import { useCustomersStore } from '../../../stores/customers.store';
import type { Customer } from '../../../types/customer';

const customersStore = useCustomersStore();
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedCustomer = ref<Customer | null>(null);

const handleEditCustomer = (customer: Customer) => {
  selectedCustomer.value = customer;
  showEditModal.value = true;
};

const closeModals = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  selectedCustomer.value = null;
};

const handleCustomerSaved = () => {
  // Customer list will be updated automatically by the store
  closeModals();
};
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
  font-weight: 700;
}

.muted {
  color: var(--color-text-muted);
  margin: 0;
}
</style>
