import type { GPTMessage } from '#shared/lib/types';

export interface Chat {
  id: number;
  messages: GPTMessage[];
}

export interface ChatHistoryStore {
  day: number;
  chats: Chat[];
}
