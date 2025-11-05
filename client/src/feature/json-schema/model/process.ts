import { createEvent, sample } from 'effector';
import { validateSuccess } from './validate';
import { shemaField } from './form';

export const createdJsonSchema = createEvent<object>();
export const resetedJsonSchema = createEvent();

sample({
  clock: validateSuccess,
  target: createdJsonSchema,
});

sample({
  clock: shemaField.$value,
  target: resetedJsonSchema,
});
