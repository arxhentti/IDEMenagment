import { defineStore } from 'pinia';
import { customersService } from '../services/customers.service';
import type { Customer, CustomerPayload } from '../types/customer';

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  saving: boolean;
  error: string;
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null) {
    const axiosLikeError = error as {
      response?: { data?: { message?: string }; statusText?: string };
      request?: unknown;
      message?: string;
    };

    if (axiosLikeError.response) {
      return axiosLikeError.response.data?.message || axiosLikeError.response.statusText || fallback;
    }

    if (axiosLikeError.request) {
      return 'Network error: backend may be unavailable.';
    }

    if (axiosLikeError.message) {
      return axiosLikeError.message;
    }
  }

  return fallback;
}

export const useCustomersStore = defineStore('customers', {
  state: (): CustomersState => ({
    customers: [],
    loading: false,
    saving: false,
    error: '',
  }),
  actions: {
    async fetchCustomers() {
      this.loading = true;
      this.error = '';

      try {
        this.customers = await customersService.getAll();
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to load customers.');
      } finally {
        this.loading = false;
      }
    },
    async createCustomer(payload: CustomerPayload) {
      this.saving = true;
      this.error = '';

      try {
        const customer = await customersService.create(payload);
        this.customers = [customer, ...this.customers];
        return customer;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to create customer.');
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async updateCustomer(id: string, payload: CustomerPayload) {
      this.saving = true;
      this.error = '';

      try {
        const updatedCustomer = await customersService.update(id, payload);
        this.customers = this.customers.map((customer) =>
          customer.id === id ? updatedCustomer : customer,
        );
        return updatedCustomer;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to update customer.');
        throw error;
      } finally {
        this.saving = false;
      }
    },
    async deleteCustomer(id: string) {
      this.error = '';

      try {
        await customersService.remove(id);
        this.customers = this.customers.filter((customer) => customer.id !== id);
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to delete customer.');
        throw error;
      }
    },
  },
});
