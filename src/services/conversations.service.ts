import { http } from './http';
import type { Conversation } from '../types/message';

export const conversationsService = {
  getAll: () => http.get<Conversation[]>('/conversations').then((response) => response.data),
  getById: (id: string) => http.get<Conversation>(`/conversations/${id}`).then((response) => response.data),
  resolve: (id: string) => http.patch(`/conversations/${id}/resolve`),
};
