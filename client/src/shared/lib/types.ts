export interface GPTToolCall {
  functionCall?: {
    name: string;
    arguments: object;
  };
}

export interface GPTToolResult {
  functionResult?: {
    name: string;
    content: string;
  };
}

export interface GPTMessageMeta {
  spentTokens?: number;
  executionDuration?: number;
  promptTokens?: number;
  completionTokens?: number;
}

export type GPTMessageRole = 'user' | 'assistant' | 'system';

export interface GPTMessage {
  role: GPTMessageRole;
  text: string;
  status: 'success' | 'process' | 'error';
  meta?: GPTMessageMeta;
}

export interface GPTTool {
  function?: {
    name: string;
    description: string;
    parameters: object;
    strict: boolean;
  };
}

export interface GPTCompletionOptions {
  stream?: boolean;
  temperature?: number;
  maxTokens?: string;
  reasoningOptions?: {
    mode: string;
  };
}

export interface GPTJsonSchema {
  schema: object;
}
