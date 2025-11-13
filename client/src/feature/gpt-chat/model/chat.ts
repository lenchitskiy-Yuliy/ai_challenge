import type { GPTMessage } from '#shared/lib/types';
import { sample } from 'effector';
import type { MessagesModel } from './messages';
import type { FetchModel } from './fetch';
import type { FormModel } from './form';
import type { CompressModel } from './compress';

export type GPTChatModel = ReturnType<typeof createGPTChatModel>;

export function createGPTChatModel({
  fetchModel,
  formModel,
  messagesModel,
  compressModel,
}: {
  fetchModel: FetchModel;
  messagesModel: MessagesModel;
  formModel: FormModel;
  compressModel?: CompressModel;
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
    clock: fetchModel.gptSucess,
    source: messagesModel.$messages,
    fn: (prevMessages, { messages, ...meta }) =>
      prevMessages
        .filter(({ status }) => status !== 'process')
        .concat(
          messages.map(
            ({ text }) =>
              <GPTMessage>{
                role: 'assistant',
                text,
                status: 'success',
                meta,
              },
          ),
        ),
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

  if (compressModel) {
    sample({
      clock: messagesModel.setMessages,
      target: compressModel.setCompressedMessages,
    });

    sample({
      clock: compressModel.compressSucess,
      fn: ({ messages }) =>
        messages.map(({ text }) => <GPTMessage>{ text, status: 'success', role: 'system' }),
      target: messagesModel.setMessages,
    });
  }

  return {
    fetchModel,
    formModel,
    messagesModel,
    compressModel,
  };
}
