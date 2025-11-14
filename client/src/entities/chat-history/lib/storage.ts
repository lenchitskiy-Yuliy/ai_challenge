import { initLocalStorage } from '#shared/lib/init-local-storage';
import type { ChatHistoryStore } from './types';

export const {
  get: getLSChatHistory,
  set: setLSChatHistory,
  clear: clearLSChatHistory,
} = initLocalStorage<ChatHistoryStore[]>({
  key: 'AICHALLENGE_LENCHJUL_CHAT_HISTORY',
});
