import type { GPTApiRequest, GPTApiResponse } from '#shared/api/gpt';
import { createFetch } from '#shared/lib/create-fetch';
import type { GPTMessage } from '#shared/lib/types';
import { combine, createEvent, restore, sample } from 'effector';
import COMPRESS_PROMPT from '../lib/compress-prompt.txt?raw';

export type CompressModel = ReturnType<typeof createCompressModel>;

export interface CreateCompressModelProps {
  handler?: (data: GPTApiRequest) => Promise<GPTApiResponse>;
}

export function createCompressModel({
  handler = () => new Promise(() => null),
}: CreateCompressModelProps) {
  const {
    fetch: compress,
    success: compressSucess,
    failure: compressFail,
    $isPending: $compressLoading,
  } = createFetch(handler);

  const setCompressedMessages = createEvent<GPTMessage[]>();
  const $messages = restore(setCompressedMessages, null);

  const triggerCompress = createEvent();
  const $disabled = combine(
    { compressLoading: $compressLoading, messages: $messages },
    ({ compressLoading, messages }) => compressLoading || !messages?.length,
  );

  sample({
    clock: triggerCompress,
    source: $messages,
    filter: Boolean,
    fn: (messages) => ({
      messages: messages
        .map(({ role, text }) => ({ role, text }))
        .concat({
          role: 'user',
          text: COMPRESS_PROMPT,
        }),
    }),
    target: compress,
  });

  return {
    compress,
    compressSucess,
    compressFail,
    $compressLoading,
    setCompressedMessages,
    triggerCompress,
    $disabled,
  };
}
