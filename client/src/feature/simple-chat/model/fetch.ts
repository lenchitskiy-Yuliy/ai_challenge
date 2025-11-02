import { gptApi } from '#shared/api/gpt';
import { createFetch } from '#shared/lib/create-fetch';

export const {
  fetch: gpt,
  success: gptSucess,
  done: gptDone,
  failure: gptFail,
  $isPending: $gptLoading,
} = createFetch(gptApi);
