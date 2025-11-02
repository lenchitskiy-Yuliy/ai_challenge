import { createResettableStore } from '#shared/lib/create-resettable-store';
import { createStringField } from '#shared/lib/fields';
import { combine, createEvent, sample } from 'effector';
import { loginFail, login, $loginLoading, loginSuccess } from './fetch';

export const {
  $store: $visibleForm,
  setStore: setVisbleForm,
  reset: resetVisbleForm,
} = createResettableStore(false);
export const passwordField = createStringField();
export const submit = createEvent();
export const $data = passwordField.$value.map((password) => {
  if (!password) return null;
  return { password };
});
export const $disabelSubmit = combine(
  { data: $data, loginLoading: $loginLoading },
  ({ data, loginLoading }) => data === null || loginLoading,
);

sample({
  clock: $data,
  target: passwordField.resetIsInvalid,
});

sample({
  clock: submit,
  source: $data,
  filter: Boolean,
  target: login,
});

sample({
  clock: loginFail,
  target: passwordField.setIsInvalid,
});

sample({
  clock: loginSuccess,
  target: [resetVisbleForm, passwordField.resetValue],
});
