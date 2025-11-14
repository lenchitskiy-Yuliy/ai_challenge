import type { GPTMessage } from '#shared/lib/types';
import { attach, createEvent, restore } from 'effector';
import { getLSChatHistory, setLSChatHistory } from '../lib/storage';
import type { Chat } from '../lib/types';

export const initChatHistory = createEvent<{ day: number }>();
const $initParams = restore(initChatHistory, null);

export const deleteChatFx = attach({
  source: $initParams,
  effect(params, ids?: Chat['id'][]) {
    if (!params) return;
    const prev = getLSChatHistory() || [];
    const currentDay = prev.find(({ day }) => day !== params.day);
    if (!currentDay) return;

    const otherDay = prev.filter(({ day }) => day !== params.day);

    if (!ids) return otherDay;

    setLSChatHistory(
      otherDay.concat({
        day: params.day,
        chats: currentDay.chats.filter(({ id }) => !ids.includes(id)),
      }),
    );
  },
});

export const saveChatFx = attach({
  source: $initParams,
  effect(params, { messages }: { messages: GPTMessage[] }) {
    if (!params) return;
    const prev = getLSChatHistory() || [];

    setLSChatHistory(
      prev
        .filter(({ day }) => day !== params.day)
        .concat({ day: params.day, chats: [{ id: 0, messages }] }),
    );
  },
});

export const getChatFx = attach({
  source: $initParams,
  effect(params) {
    console.log(params);
    if (!params) return [];
    return getLSChatHistory()?.find(({ day }) => day === params.day)?.chats || [];
  },
});
