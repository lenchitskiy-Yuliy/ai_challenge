import { type GPTApiRequest, type GPTApiResponse } from '#shared/api/gpt';
import { createFetch } from '#shared/lib/create-fetch';

export type FetchModel = ReturnType<typeof createFetchModel>;

export interface CreateFetchModelProps {
  handler: (data: GPTApiRequest) => Promise<GPTApiResponse>;
}

export function createFetchModel({
  handler,
}: {
  handler: (data: GPTApiRequest) => Promise<GPTApiResponse>;
}) {
  const {
    fetch: gpt,
    success: gptSucess,
    done: gptDone,
    failure: gptFail,
    $isPending: $gptLoading,
  } = createFetch(handler);

  return { gpt, gptSucess, gptDone, gptFail, $gptLoading };
}
