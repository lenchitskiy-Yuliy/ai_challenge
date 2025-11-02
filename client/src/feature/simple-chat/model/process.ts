import type { GPTMessage } from '#shared/lib/types';
import { createEvent, sample } from 'effector';
import { setMessages } from './store';
import { gptDone } from './fetch';

export const addMessage = createEvent<GPTMessage>();

sample({
  clock: gptDone,
  fn: ({ result: { reply }, params: { messages } }) =>
    messages.concat(<GPTMessage>{
      role: 'assistant',
      text: reply,
    }),
  target: setMessages,
});
