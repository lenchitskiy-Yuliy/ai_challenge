import { createStringField } from '#shared/lib/fields';
import { combine, createEvent, sample } from 'effector';
import { $gptLoading, gpt, gptFail, gptSucess } from './fetch';
import { $messages } from './store';

export const promptField = createStringField();
export const submit = createEvent();

export const $data = combine(
  { prompt: promptField.$value, messages: $messages },
  ({ prompt, messages }) => {
    if (!prompt) return null;
    return {
      messages: messages.concat({
        role: 'user',
        text: prompt,
      }),
    };
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
