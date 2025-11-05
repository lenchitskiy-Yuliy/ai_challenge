import { sample } from 'effector';

import { routes } from '#shared/routing';
import { resetAll } from '#shared/lib/create-resettable-store';
import { createdJsonSchema, resetedJsonSchema } from '#feature/json-schema';
import { resetJsonSchema, setJsonSchema } from '#feature/simple-chat';

sample({
  clock: createdJsonSchema,
  fn: (schema) => ({ schema }),
  target: setJsonSchema,
});

sample({
  clock: resetedJsonSchema,
  target: resetJsonSchema,
});

sample({
  clock: routes.day2.route.closed,
  target: resetAll,
});
