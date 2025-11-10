import type { GPTMessage } from '#shared/lib/types';
import { sample } from 'effector';
import type { MessagesModel } from './messages';
import type { FetchModel } from './fetch';
import type { FormModel } from './form';

export type GPTChatModel = ReturnType<typeof createGPTChatModel>;

export function createGPTChatModel({
  fetchModel,
  formModel,
  messagesModel,
}: {
  fetchModel: FetchModel;
  messagesModel: MessagesModel;
  formModel: FormModel;
}) {
  sample({
    clock: fetchModel.gpt,
    fn: ({ messages }) => {
      return messages.concat(<GPTMessage>{
        role: 'assistant',
        text: '🤔 Думаю...',
      });
    },
    target: messagesModel.setMessages,
  });

  sample({
    clock: fetchModel.gptDone,
    source: messagesModel.$messages,
    fn: (messages, { result: { reply } }) => {
      return [
        ...messages.slice(0, -1),
        <GPTMessage>{
          role: 'assistant',
          text: reply,
        },
      ];
    },
    target: messagesModel.setMessages,
  });

  sample({
    clock: fetchModel.gptFail,
    source: messagesModel.$messages,
    fn: (messages) => {
      return [
        ...messages.slice(0, -1),
        <GPTMessage>{
          role: 'assistant',
          text: '❌ Ошибка',
        },
      ];
    },
    target: messagesModel.setMessages,
  });

  return {
    fetchModel,
    formModel,
    messagesModel,
  };
}
