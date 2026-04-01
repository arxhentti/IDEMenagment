import { http } from './http';
import type { CreateMessagePayload, Message } from '../types/message';

export const messagesService = {
  getByConversation: (conversationId: string) =>
    http.get<Message[]>(`/messages/conversation/${conversationId}`).then((response) => response.data),
  create: (payload: CreateMessagePayload) =>
    http.post<Message>('/messages', payload).then((response) => response.data),
};
