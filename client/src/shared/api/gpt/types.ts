import type { GPTMessage, GPTCompletionOptions, GPTJsonSchema, GPTTool } from '#shared/lib/types';

export interface GPTApiRequest {
  messages: Pick<GPTMessage, 'role' | 'text'>[];
  completionOptions?: GPTCompletionOptions;
  tools?: GPTTool[];
  jsonObject?: boolean;
  jsonSchema?: GPTJsonSchema;
  parallelToolCalls?: boolean;
  toolChoice?: {
    mode: string;
    functionName: string;
  };
}

export interface GPTApiResponse {
  reply: string;
  spentTokens?: number;
  executionDuration?: number;
  promptTokens?: number;
  completionTokens?: number;
}
