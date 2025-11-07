import { gptApi } from '#shared/api/gpt';
import { createFetch } from '#shared/lib/create-fetch';

export type FetchModel = ReturnType<typeof createFetchModel>;

export function createFetchModel() {
  const {
    fetch: gpt,
    success: gptSucess,
    done: gptDone,
    failure: gptFail,
    $isPending: $gptLoading,
  } = createFetch(gptApi);

  return { gpt, gptSucess, gptDone, gptFail, $gptLoading };
}
