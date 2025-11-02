import { createEvent, sample } from 'effector';

import { $checkAuthLoading, checkAuth, checkAuthFail } from './fetch';
import { setVisbleForm } from './form';

export const mount = createEvent();
export const $pageLoading = $checkAuthLoading;

sample({
  clock: mount,
  target: checkAuth,
});

sample({
  clock: checkAuthFail,
  fn: () => true,
  target: setVisbleForm,
});
