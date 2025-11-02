import { checkAuthApi, loginApi } from '#shared/api/auth';
import { createFetch } from '#shared/lib/create-fetch';

export const {
  fetch: checkAuth,
  failure: checkAuthFail,
  $isPending: $checkAuthLoading,
} = createFetch(checkAuthApi);

export const {
  fetch: login,
  success: loginSuccess,
  failure: loginFail,
  $isPending: $loginLoading,
} = createFetch(loginApi);
