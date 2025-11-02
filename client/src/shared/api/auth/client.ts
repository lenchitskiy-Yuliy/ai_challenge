import { getBaseApiClient } from '#shared/lib/get-base-api-client';
import type { LoginApiRequest } from './types';

const auth = getBaseApiClient();

export function checkAuthApi() {
  return auth.get('auth-check');
}

export function loginApi(data: LoginApiRequest) {
  return auth.post('login', { json: data });
}
