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

export interface GPTMessage {
  role: 'user' | 'assistant' | 'system';
  text: string;
  toolCallList?: {
    toolCalls: GPTToolCall[];
  };
  toolResultList?: {
    toolResults: GPTToolResult[];
  };
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
