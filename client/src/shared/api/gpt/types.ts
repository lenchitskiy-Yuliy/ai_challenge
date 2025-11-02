import type { GPTMessage } from '#shared/lib/types';

export interface GPTApiRequest {
  messages: GPTMessage[];
}

export interface GPTApiResponce {
  reply: string;
}
