import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { combineGPTChatModel } from '#feature/gpt-chat';
import { yndexGptApi } from '#shared/api/gpt';

export const { GPTChatModel } = combineGPTChatModel({
  fetchProps: { handler: yndexGptApi },
  compress: { handler: yndexGptApi },
});

sample({
  clock: routes.day8.route.closed,
  target: resetAll,
});
