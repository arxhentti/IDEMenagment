import { defineStore } from 'pinia';
import { dashboardService } from '../services/dashboard.service';
import type { DashboardStats } from '../types/dashboard';

interface DashboardState {
  stats: DashboardStats | null;
  loading: boolean;
  error: string;
}

export const useDashboardStore = defineStore('dashboard', {
  state: (): DashboardState => ({
    stats: null,
    loading: false,
    error: '',
  }),
  actions: {
    async fetchStats() {
      this.loading = true;
      this.error = '';

      try {
        this.stats = await dashboardService.getStats();
      } catch (error: any) {
        console.error('Dashboard API Error:', error);
        if (error.response) {
          // Server responded with error status
          this.error = `API Error ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
        } else if (error.request) {
          // Network error
          this.error = 'Network Error: Cannot connect to server. Check if backend is running.';
        } else {
          // Other error
          this.error = error.message || 'Failed to load dashboard stats.';
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
