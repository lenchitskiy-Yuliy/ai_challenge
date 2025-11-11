import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { createdJsonSchema, resetedJsonSchema } from '#feature/json-schema';
import { combineGPTChatModel } from '#feature/gpt-chat';
import { yndexGptApi } from '#shared/api/gpt';

export const { GPTChatModel, formModel } = combineGPTChatModel({
  fetchProps: { handler: yndexGptApi },
});

sample({
  clock: createdJsonSchema,
  fn: (schema) => ({ schema }),
  target: formModel.setJsonSchema,
});

sample({
  clock: resetedJsonSchema,
  target: formModel.resetJsonSchema,
});

sample({
  clock: routes.day2.route.closed,
  target: resetAll,
});
