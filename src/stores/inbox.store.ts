import { defineStore } from 'pinia';
import { conversationsService } from '../services/conversations.service';
import { messagesService } from '../services/messages.service';
import type { Conversation, CreateMessagePayload, Message } from '../types/message';

interface InboxState {
  conversations: Conversation[];
  selectedConversationId: string;
  messagesByConversation: Record<string, Message[]>;
  loading: boolean;
  sending: boolean;
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

export const useInboxStore = defineStore('inbox', {
  state: (): InboxState => ({
    conversations: [],
    selectedConversationId: '',
    messagesByConversation: {},
    loading: false,
    sending: false,
    error: '',
  }),
  getters: {
    selectedConversation(state) {
      return state.conversations.find((item) => item.id === state.selectedConversationId) || null;
    },
    selectedMessages(state) {
      return state.messagesByConversation[state.selectedConversationId] || [];
    },
  },
  actions: {
    async fetchConversations() {
      this.loading = true;
      this.error = '';

      try {
        this.conversations = await conversationsService.getAll();
        if (!this.selectedConversationId && this.conversations.length > 0) {
          this.selectedConversationId = this.conversations[0].id;
        }
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to load conversations.');
      } finally {
        this.loading = false;
      }
    },
    async selectConversation(id: string) {
      this.selectedConversationId = id;

      if (!this.messagesByConversation[id]) {
        await this.fetchMessages(id);
      }
    },
    async fetchMessages(conversationId: string) {
      this.loading = true;
      this.error = '';

      try {
        this.messagesByConversation[conversationId] = await messagesService.getByConversation(conversationId);
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to load messages.');
      } finally {
        this.loading = false;
      }
    },
    async sendMessage(payload: CreateMessagePayload) {
      this.sending = true;
      this.error = '';

      try {
        const message = await messagesService.create(payload);
        const currentMessages = this.messagesByConversation[payload.conversationId] || [];
        this.messagesByConversation[payload.conversationId] = [...currentMessages, message];
        return message;
      } catch (error) {
        this.error = getErrorMessage(error, 'Failed to send message.');
        throw error;
      } finally {
        this.sending = false;
      }
    },
  },
});
