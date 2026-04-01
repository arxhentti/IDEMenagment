export type MessageSource = 1 | 2 | 3 | 4;

export interface Message {
  id: string;
  content: string;
  source: MessageSource;
  isAutoReply: boolean;
  createdAtUtc: string;
}

export interface CreateMessagePayload {
  conversationId: string;
  content: string;
  source?: MessageSource;
  isAutoReply?: boolean;
}

export interface ConversationCustomer {
  id: string;
  fullName: string;
  phoneNumber: string;
  instagramUsername?: string | null;
  whatsAppNumber?: string | null;
}

export interface Conversation {
  id: string;
  platform: string;
  externalThreadId: string;
  isResolved: boolean;
  lastMessageAtUtc?: string | null;
  customerId: string;
  customer?: ConversationCustomer | null;
  messages?: Message[];
}
