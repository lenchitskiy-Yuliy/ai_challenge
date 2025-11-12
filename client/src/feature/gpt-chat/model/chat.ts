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
    source: messagesModel.$messages,
    fn: (messages, request) =>
      messages.concat(<GPTMessage[]>[
        {
          role: 'user',
          status: 'success',
          text: request.messages[request.messages.length - 1].text,
        },
        {
          role: 'assistant',
          text: '🤔 Думаю...',
          status: 'process',
        },
      ]),
    target: messagesModel.setMessages,
  });

  sample({
    clock: fetchModel.gptDone,
    source: messagesModel.$messages,
    fn: (messages, { result: { reply, ...meta } }) =>
      messages
        .filter(({ status }) => status !== 'process')
        .concat({
          role: 'assistant',
          text: reply,
          status: 'success',
          meta,
        }),
    target: messagesModel.setMessages,
  });

  sample({
    clock: fetchModel.gptFail,
    source: messagesModel.$messages,
    fn: (messages) =>
      messages
        .filter(({ status }) => status !== 'process')
        .concat({
          role: 'assistant',
          text: '❌ Ошибка',
          status: 'success',
        }),
    target: messagesModel.setMessages,
  });

  return {
    fetchModel,
    formModel,
    messagesModel,
  };
}
