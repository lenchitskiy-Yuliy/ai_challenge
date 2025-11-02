import { createEvent, createStore, restore, sample, type EventCallable } from 'effector';

import { createResettableStore, resetAll } from '#shared/lib/create-resettable-store';

export interface CreateFieldOptions<Value extends string> {
  initialValue?: Value;
  initialDisabled?: boolean;
  required?: boolean;
  isHidden?: boolean;
}

export function createField<Value extends string>(options?: CreateFieldOptions<Value>) {
  const {
    setStore: setValue,
    reset: resetValue,
    $store: $value,
  } = createResettableStore(options?.initialValue || null);

  const { setStore: setRequired, $store: $required } = createResettableStore(
    options?.required || false,
  );

  const setIsTouched = createEvent<boolean>();
  const resetIsTouched = createEvent();
  const $isTouched = restore(setIsTouched, false).reset(resetIsTouched);

  const setIsDisabled = createEvent<boolean>();
  const resetIsDisabled = createEvent();
  const $isDisabled = restore(setIsDisabled, options?.initialDisabled || false).reset(
    resetIsDisabled,
  );

  const setIsHidden = createEvent<boolean>();
  const resetIsHidden = createEvent();
  const $isHidden = restore(setIsHidden, options?.isHidden || false).reset(resetIsHidden);

  const setIsInvalid = createEvent();
  const resetIsInvalid = createEvent();
  const $isInvalid = createStore(false).reset(resetIsInvalid);

  const setInvalidMessage = createEvent<string>();
  const resetInvalidMessage = createEvent();
  const $invalidMessage = restore(setInvalidMessage, '').reset(resetInvalidMessage);

  sample({
    clock: resetAll,
    target: [resetIsInvalid, resetIsTouched, resetInvalidMessage, resetIsDisabled],
  });

  sample({
    clock: setValue,
    fn: () => true,
    target: setIsTouched,
  });

  sample({
    clock: setIsInvalid,
    source: $isTouched,
    filter: Boolean,
    fn: () => true,
    target: $isInvalid,
  });

  return {
    $value,
    $isDisabled,
    setIsTouched,
    resetIsTouched,
    resetIsDisabled,
    setIsDisabled,
    setValue: setValue as EventCallable<Value>,
    resetValue,
    $isInvalid,
    setIsInvalid,
    resetIsInvalid,
    $invalidMessage,
    setInvalidMessage,
    resetInvalidMessage,
    setIsHidden,
    resetIsHidden,
    $isHidden,
    setRequired,
    $required,
  };
}
