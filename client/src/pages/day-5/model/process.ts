import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { combineGPTChatModel } from '#feature/gpt-chat';

export const { GPTChatModel: firstGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0 },
});

export const { GPTChatModel: secondGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0.5 },
});

export const { GPTChatModel: thirdGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 1 },
});

sample({
  clock: routes.day5.route.closed,
  target: resetAll,
});
