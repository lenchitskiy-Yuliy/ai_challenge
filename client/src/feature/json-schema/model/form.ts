import { createResettableStore } from '#shared/lib/create-resettable-store';
import { createStringField } from '#shared/lib/fields';
import { combine, createEvent, sample } from 'effector';
import type { Status } from '../lib/type';
import { validate, validateFail, validateSuccess } from './validate';

export const {
  $store: $status,
  setStore: setStatus,
  reset: resetStatus,
} = createResettableStore<Status>('none');

export const shemaField = createStringField();

export const submit = createEvent();
export const $disableSubmit = combine({
  value: shemaField.$value,
  status: $status,
}).map(({ value, status }) => status === 'none' && !value);

sample({
  clock: shemaField.$value,
  target: resetStatus,
});

sample({
  clock: submit,
  source: shemaField.$value,
  filter: Boolean,
  target: validate,
});

sample({
  clock: validateSuccess,
  fn: () => <Status>'success',
  target: setStatus,
});

sample({
  clock: validateFail,
  fn: () => <Status>'error',
  target: setStatus,
});
