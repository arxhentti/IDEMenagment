import { defineStore } from 'pinia';
import { integrationsService } from '../services/integrations.service';
import type { Integration } from '../types/integration';

interface IntegrationsState {
  integrations: Integration[];
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

export const useIntegrationsStore = defineStore('integrations', {
  state: (): IntegrationsState => ({
    integrations: [],
    loading: false,
    saving: false,
    error: '',
  }),
  actions: {
    async fetchIntegrations() {
      this.loading = true;
      this.error = '';

      try {
        this.integrations = await integrationsService.getAll();
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to load integrations.');
      } finally {
        this.loading = false;
      }
    },
    async toggleIntegrationConnection(id: string, isConnected: boolean) {
      this.saving = true;
      this.error = '';

      try {
        const updatedIntegration = await integrationsService.toggleConnection(id, isConnected);
        this.integrations = this.integrations.map((integration) =>
          integration.id === id ? updatedIntegration : integration,
        );
        return updatedIntegration;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to update integration status.');
        throw error;
      } finally {
        this.saving = false;
      }
    },
  },
});
