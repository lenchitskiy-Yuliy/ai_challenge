import { createEffect, createEvent, sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { combineGPTChatModel } from '#feature/gpt-chat';
import { yndexGptApi } from '#shared/api/gpt';
import { initChatHistory, getChatFx, deleteChatFx, saveChatFx } from '#entities/chat-history';

export const mount = createEvent();
export const { GPTChatModel } = combineGPTChatModel({
  fetchProps: { handler: yndexGptApi },
});

sample({
  clock: mount,
  fn: () => ({ day: 9 }),
  target: initChatHistory,
});

sample({
  clock: mount,
  target: createEffect(async () => {
    const [chat] = await getChatFx();

    if (chat) GPTChatModel.messagesModel.setMessages(chat.messages);
  }),
});

sample({
  clock: GPTChatModel.messagesModel.setMessages,
  fn: (messages) => ({ messages }),
  target: saveChatFx,
});

sample({
  clock: GPTChatModel.clearChat,
  target: deleteChatFx,
});

sample({
  clock: routes.day9.route.closed,
  target: resetAll,
});
