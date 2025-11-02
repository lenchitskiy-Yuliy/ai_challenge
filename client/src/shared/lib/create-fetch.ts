import {
  createEffect,
  createEvent,
  createStore,
  sample,
  type EventCallable,
  type Event,
  type Store,
} from 'effector';

export const createFetch = <Argument = void, Result = unknown, CustomError = Error>(
  fn: (arg: Argument) => Promise<Result>,
): {
  fetch: EventCallable<Argument>;
  done: Event<{
    params: Argument;
    result: Result;
  }>;
  success: Event<Result>;
  $isPending: Store<boolean>;
  failure: Event<CustomError | Error>;
  finally: Event<
    | {
        status: 'done';
        params: Argument;
        result: Result;
      }
    | {
        status: 'fail';
        params: Argument;
        error: CustomError | Error;
      }
  >;
  $isFailure: Store<boolean>;
} => {
  const fetch = createEvent<Argument>();
  const fetchFx = createEffect<Argument, Result, CustomError | Error>(fn);
  const $isFailure = createStore(false)
    .on(fetchFx.failData, () => true)
    .reset(fetch);

  sample({ clock: fetch, target: fetchFx });

  return {
    fetch,
    $isPending: fetchFx.pending,
    done: fetchFx.done,
    success: fetchFx.doneData,
    failure: fetchFx.failData,
    finally: fetchFx.finally,
    $isFailure,
  };
};
