import { defineStore } from 'pinia';
import { authService } from '../services/auth.service';
import type { AuthResponse, LoginInput, RegisterInput } from '../types/auth';
import { clearToken, getToken, setToken } from '../utils/token';
import { useCustomersStore } from './customers.store';
import { useDashboardStore } from './dashboard.store';
import { useInboxStore } from './inbox.store';
import { useIntegrationsStore } from './integrations.store';
import { useOrdersStore } from './orders.store';
import { useProductsStore } from './products.store';

interface AuthState {
  token: string;
  profile: AuthResponse | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: getToken(),
    profile: null,
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token),
  },
  actions: {
    resetSessionStores() {
      useDashboardStore().$reset();
      useCustomersStore().$reset();
      useProductsStore().$reset();
      useOrdersStore().$reset();
      useInboxStore().$reset();
      useIntegrationsStore().$reset();
    },
    async login(payload: LoginInput) {
      const response = await authService.login(payload);
      this.setSession(response);
    },
    async register(payload: RegisterInput) {
      return await authService.register(payload);
    },
    setSession(response: AuthResponse) {
      this.resetSessionStores();
      this.token = response.token;
      this.profile = response;
      setToken(response.token);
    },
    logout() {
      this.resetSessionStores();
      this.token = '';
      this.profile = null;
      clearToken();
    },
  },
});
