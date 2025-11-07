import { createResettableStore } from '#shared/lib/create-resettable-store';
import type { GPTMessage } from '#shared/lib/types';

export type MessagesModel = ReturnType<typeof createMessagesModel>;

export function createMessagesModel() {
  const { $store: $messages, setStore: setMessages } = createResettableStore<GPTMessage[]>([]);

  return { $messages, setMessages };
}
