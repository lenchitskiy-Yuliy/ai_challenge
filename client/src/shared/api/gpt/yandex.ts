import { getBaseApiClient } from '#shared/lib/get-base-api-client';

import type { GPTApiRequest, GPTApiResponse } from './types';

const gpt = getBaseApiClient();

export function yndexGptApi(data: GPTApiRequest) {
  return gpt.post('gpt', { json: data }).json<GPTApiResponse>();
}
