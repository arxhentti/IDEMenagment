import { http } from './http';
import type { Integration } from '../types/integration';

export const integrationsService = {
  getAll: () => http.get<Integration[]>('/integrations').then((response) => response.data),
  toggleConnection: (id: string, isConnected: boolean) =>
    http
      .patch<Integration>(`/integrations/${id}/connection`, undefined, { params: { isConnected } })
      .then((response) => response.data),
};
