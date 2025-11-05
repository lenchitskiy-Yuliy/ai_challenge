import { createEvent, createStore, sample, type EventCallable, type Store } from 'effector';

export const resetAll = createEvent();

type Options = {
  resetEvents?: EventCallable<any>[];
};

export function createResettableStore<T>(
  initialState: null,
  options?: Options,
): {
  reset: EventCallable<void>;
  setStore: EventCallable<T>;
  $store: Store<T | null>;
};

export function createResettableStore<T>(
  initialState: T,
  options?: Options,
): {
  reset: EventCallable<void>;
  setStore: EventCallable<T>;
  $store: Store<T>;
};

export function createResettableStore<T>(initialState: T | null, options?: Options) {
  const reset = createEvent();
  const setStore = createEvent();

  const $store = createStore(initialState)
    .reset(reset)
    .on(setStore, (_, newState) => newState);

  if (options && options.resetEvents) {
    sample({
      clock: options.resetEvents,
      target: reset,
    });
  }

  sample({ clock: resetAll, target: reset });

  return {
    reset,
    setStore,
    $store,
    resetAll,
  };
}
