import { createStringField } from '#shared/lib/fields';
import { combine, createEvent, sample } from 'effector';
import type { FetchModel } from './fetch';
import type { MessagesModel } from './messages';
import { createResettableStore } from '#shared/lib/create-resettable-store';
import type { GPTJsonSchema } from '#shared/lib/types';
import type { GPTApiRequest } from '#shared/api/gpt';

export type FormModel = ReturnType<typeof createFormModel>;
export interface CreateFormModelProps {
  temperature?: number;
}

export function createFormModel({
  messagesModel,
  fetchModel,
  temperature,
}: {
  messagesModel: MessagesModel;
  fetchModel: FetchModel;
} & CreateFormModelProps) {
  const promptField = createStringField();
  const submit = createEvent();

  const {
    $store: $jsonSchema,
    setStore: setJsonSchema,
    reset: resetJsonSchema,
  } = createResettableStore<GPTJsonSchema>(null);

  const $data = combine(
    { prompt: promptField.$value, messages: messagesModel.$messages, jsonSchema: $jsonSchema },
    ({ prompt, messages, jsonSchema }) => {
      if (!prompt) return null;

      const data: GPTApiRequest = {
        messages: messages.concat({
          role: 'user',
          text: prompt,
        }),
      };

      if (temperature !== undefined) data.completionOptions = { temperature };
      if (jsonSchema) data.jsonSchema = jsonSchema;

      return data;
    },
  );
  const $submiting = fetchModel.$gptLoading;
  const $disabelSubmit = combine(
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
    target: [fetchModel.gpt, promptField.resetValue],
  });

  sample({
    clock: fetchModel.gptFail,
    target: promptField.setIsInvalid,
  });

  sample({
    clock: fetchModel.gptSucess,
    target: promptField.resetValue,
  });

  return {
    promptField,
    submit,
    $jsonSchema,
    setJsonSchema,
    resetJsonSchema,
    $data,
    $submiting,
    $disabelSubmit,
  };
}
