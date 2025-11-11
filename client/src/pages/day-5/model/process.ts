import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { combineGPTChatModel } from '#feature/gpt-chat';
import { yndexGptApi } from '#shared/api/gpt';

export const { GPTChatModel: firstGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0 },
  fetchProps: { handler: yndexGptApi },
});

export const { GPTChatModel: secondGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0.5 },
  fetchProps: { handler: yndexGptApi },
});

export const { GPTChatModel: thirdGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 1 },
  fetchProps: { handler: yndexGptApi },
});

sample({
  clock: routes.day5.route.closed,
  target: resetAll,
});
