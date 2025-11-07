import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { combineGPTChatModel } from '#feature/gpt-chat';

export const { GPTChatModel: firstGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0.1 },
});
export const { GPTChatModel: secondGPTChatModel } = combineGPTChatModel({
  formProps: { temperature: 0.1 },
});
export const { GPTChatModel: thirdGPTChatModel } = combineGPTChatModel();
export const { GPTChatModel: fourthGPTChatModel } = combineGPTChatModel();

sample({
  clock: routes.day3.route.closed,
  target: resetAll,
});
