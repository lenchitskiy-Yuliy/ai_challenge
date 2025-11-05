import Ajv from 'ajv';
import { createEffect, createEvent, createStore, sample } from 'effector';
import { DEFAULT_ERROR_TEXT } from '../lib/constants';

const ajv = new Ajv({ allErrors: true });

export const validate = createEvent<string>();
const validateFx = createEffect((value: string) => {
  const parsed = JSON.parse(value);

  if (typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('JSON Schema должен быть объектом.');
  }

  parsed.$schema = 'http://json-schema.org/draft-07/schema#';

  const validate = ajv.validateSchema(parsed);

  if (validate) {
    return parsed;
  } else {
    throw new Error('Некорректная структура JSON Schema.');
  }
});
export const validateSuccess = validateFx.doneData;
export const validateFail = validateFx.failData;

export const $errorMessage = createStore(DEFAULT_ERROR_TEXT)
  .on(validateFail, (_, error) => {
    console.log(error.message || DEFAULT_ERROR_TEXT);

    return error.message || DEFAULT_ERROR_TEXT;
  })
  .reset(validate);

sample({ clock: validate, target: validateFx });
