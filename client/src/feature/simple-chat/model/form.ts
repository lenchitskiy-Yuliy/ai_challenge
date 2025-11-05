import { createStringField } from '#shared/lib/fields';
import { combine, createEvent, sample } from 'effector';
import { $gptLoading, gpt, gptFail, gptSucess } from './fetch';
import { $messages } from './store';
import { createResettableStore } from '#shared/lib/create-resettable-store';
import type { GPTJsonSchema } from '#shared/lib/types';
import type { GPTApiRequest } from '#shared/api/gpt';

export const promptField = createStringField();
export const submit = createEvent();

export const {
  $store: $jsonSchema,
  setStore: setJsonSchema,
  reset: resetJsonSchema,
} = createResettableStore<GPTJsonSchema>(null);

export const $data = combine(
  { prompt: promptField.$value, messages: $messages, jsonSchema: $jsonSchema },
  ({ prompt, messages, jsonSchema }) => {
    if (!prompt) return null;

    const data: GPTApiRequest = {
      messages: messages.concat({
        role: 'user',
        text: prompt,
      }),
    };

    if (jsonSchema) data.jsonSchema = jsonSchema;

    return data;
  },
);
export const $submiting = $gptLoading;
export const $disabelSubmit = combine(
  { data: $data, submiting: $submiting },
  ({ data, submiting }) => data === null || submiting,
);

sample({
  clock: $data,
  target: promptField.resetIsInvalid,
});

sample({
  clock: submit,
  source: $data,
  filter: Boolean,
  target: gpt,
});

sample({
  clock: gptFail,
  target: promptField.setIsInvalid,
});

sample({
  clock: gptSucess,
  target: promptField.resetValue,
});
