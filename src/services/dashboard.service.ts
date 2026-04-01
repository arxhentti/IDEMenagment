import { http } from './http';
import type { DashboardStats } from '../types/dashboard';

export const dashboardService = {
  getStats: () => http.get<DashboardStats>('/dashboard/stats').then((response) => response.data),
};
