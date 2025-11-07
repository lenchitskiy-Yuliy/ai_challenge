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
        text: '🤔 Thinking...',
      });
    },
    target: messagesModel.setMessages,
  });

  sample({
    clock: fetchModel.gptDone,
    source: messagesModel.$messages,
    fn: (messages, { result: { reply } }) => {
      if (messages.length > 0 && messages[messages.length - 1].text === '🤔 Thinking...') {
        return [
          ...messages.slice(0, -1),
          <GPTMessage>{
            role: 'assistant',
            text: reply,
          },
        ];
      }

      return messages.concat(<GPTMessage>{
        role: 'assistant',
        text: reply,
      });
    },
    target: messagesModel.setMessages,
  });

  sample({
    clock: fetchModel.gptFail,
    source: messagesModel.$messages,
    fn: (messages) => {
      if (messages.length > 0 && messages[messages.length - 1].text === '🤔 Thinking...') {
        return [
          ...messages.slice(0, -1),
          <GPTMessage>{
            role: 'assistant',
            text: '❌ Error processing request',
          },
        ];
      }

      return messages.concat(<GPTMessage>{
        role: 'assistant',
        text: '❌ Error processing request',
      });
    },
    target: messagesModel.setMessages,
  });

  return {
    fetchModel,
    formModel,
    messagesModel,
  };
}
