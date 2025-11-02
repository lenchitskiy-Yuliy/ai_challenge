import { createResettableStore } from '#shared/lib/create-resettable-store';
import type { GPTMessage } from '#shared/lib/types';

export const { $store: $messages, setStore: setMessages } = createResettableStore<GPTMessage[]>([]);
