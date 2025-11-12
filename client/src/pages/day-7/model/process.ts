import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { combineGPTChatModel } from '#feature/gpt-chat';
import { huggingfaceMetaLlamaApi } from '#shared/api/gpt';

export const { GPTChatModel: firstGPTChatModel } = combineGPTChatModel({
  fetchProps: { handler: huggingfaceMetaLlamaApi },
});

export const { GPTChatModel: secondGPTChatModel } = combineGPTChatModel({
  fetchProps: { handler: huggingfaceMetaLlamaApi },
});

export const { GPTChatModel: thirdGPTChatModel } = combineGPTChatModel({
  fetchProps: { handler: huggingfaceMetaLlamaApi },
});

sample({
  clock: routes.day7.route.closed,
  target: resetAll,
});
