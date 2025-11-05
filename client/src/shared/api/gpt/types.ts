import type { GPTMessage, GPTCompletionOptions, GPTJsonSchema, GPTTool } from '#shared/lib/types';

export interface GPTApiRequest {
  messages: GPTMessage[];
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

export interface GPTApiResponce {
  reply: string;
}
