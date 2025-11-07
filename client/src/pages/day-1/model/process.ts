import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';

import { combineGPTChatModel } from '#feature/gpt-chat';

export const { GPTChatModel } = combineGPTChatModel();

sample({
  clock: routes.day1.route.closed,
  target: resetAll,
});
