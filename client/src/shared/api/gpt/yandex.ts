import { getBaseApiClient } from '#shared/lib/get-base-api-client';

import type { GPTApiRequest, GPTApiResponse, YandexResponse } from './types';

const gpt = getBaseApiClient();

export async function yndexGptApi(data: GPTApiRequest): Promise<GPTApiResponse> {
  const startTime = Date.now();

  const { result } = await gpt.post('gpt', { json: data }).json<YandexResponse>();

  return {
    messages: result.alternatives.map(({ message }) => message),
    promptTokens: result.usage.inputTextTokens,
    spentTokens: result.usage.totalTokens,
    completionTokens: result.usage.completionTokens,
    executionDuration: Date.now() - startTime,
  };
}
