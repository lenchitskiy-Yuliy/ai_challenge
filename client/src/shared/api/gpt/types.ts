import type { GPTMessage, GPTCompletionOptions, GPTJsonSchema, GPTTool } from '#shared/lib/types';

export type ApiGPTMessage = Pick<GPTMessage, 'role' | 'text'>;

export interface YandexResponse {
  result: {
    alternatives: {
      message: ApiGPTMessage;
    }[];
    usage: {
      inputTextTokens: string;
      completionTokens: string;
      totalTokens: string;
    };
  };
}

export interface GPTApiRequest {
  messages: ApiGPTMessage[];
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
  messages: ApiGPTMessage[];
  spentTokens?: number | string;
  executionDuration?: number;
  promptTokens?: number | string;
  completionTokens?: number | string;
}
