import { getBaseApiClient } from '#shared/lib/get-base-api-client';

import type { GPTApiRequest, GPTApiResponce } from './types';

const gpt = getBaseApiClient();

export function gptApi(data: GPTApiRequest) {
  return gpt.post('gpt', { json: data }).json<GPTApiResponce>();
}
