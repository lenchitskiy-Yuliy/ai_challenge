import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { combineGPTChatModel } from '#feature/gpt-chat';
import { huggingfaceBaiduAPI, huggingfaceQwenAPI, huggingfaceOpenaiAPI } from '#shared/api/gpt';

export const { GPTChatModel: firstGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0.5 },
  fetchProps: { handler: huggingfaceOpenaiAPI },
});

export const { GPTChatModel: secondGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0.5 },
  fetchProps: { handler: huggingfaceQwenAPI },
});

export const { GPTChatModel: thirdGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0.5 },
  fetchProps: { handler: huggingfaceBaiduAPI },
});

sample({
  clock: routes.day6.route.closed,
  target: resetAll,
});
