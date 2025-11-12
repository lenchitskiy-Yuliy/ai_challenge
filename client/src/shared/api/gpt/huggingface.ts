import { InferenceClient } from '@huggingface/inference';
import type { GPTApiRequest, GPTApiResponse } from './types';

const client = new InferenceClient(import.meta.env.VITE_HUGGINGFACE);

export async function huggingfaceMetaLlamaApi(data: GPTApiRequest): Promise<GPTApiResponse> {
  const startTime = Date.now();

  const result = await client.chatCompletion({
    model: 'meta-llama/Llama-3.1-8B-Instruct',
    messages: data.messages.map(({ role, text }) => ({ role, content: text })),
    max_tokens: 512,
  });

  return {
    reply: result.choices[0]?.message.content || '',
    promptTokens: result.usage.prompt_tokens,
    completionTokens: result.usage.completion_tokens,
    executionDuration: Date.now() - startTime,
  };
}

export async function huggingfaceOpenaiAPI(data: GPTApiRequest): Promise<GPTApiResponse> {
  const startTime = Date.now();

  const result = await client.chatCompletion({
    model: 'openai/gpt-oss-safeguard-20b',
    messages: data.messages.map(({ role, text }) => ({ role, content: text })),
    max_tokens: 512,
  });

  const { message } = result.choices[0] || {};

  return {
    reply: message.content || '',
    spentTokens: result.usage.total_tokens,
    executionDuration: Date.now() - startTime,
  };
}

export async function huggingfaceQwenAPI(data: GPTApiRequest): Promise<GPTApiResponse> {
  const startTime = Date.now();

  const result = await client.chatCompletion({
    model: 'Qwen/Qwen3-235B-A22B-Thinking-2507',
    messages: data.messages.map(({ role, text }) => ({ role, content: text })),
    max_tokens: 512,
  });

  const { message } = result.choices[0] || {};

  return {
    reply: message.content || '',
    spentTokens: result.usage.total_tokens,
    executionDuration: Date.now() - startTime,
  };
}

export async function huggingfaceBaiduAPI(data: GPTApiRequest): Promise<GPTApiResponse> {
  const startTime = Date.now();

  const result = await client.chatCompletion({
    model: 'baidu/ERNIE-4.5-300B-A47B-Base-PT',
    messages: data.messages.map(({ role, text }) => ({ role, content: text })),
    max_tokens: 512,
  });

  const { message } = result.choices[0] || {};

  return {
    reply: message.content || '',
    spentTokens: result.usage.total_tokens,
    executionDuration: Date.now() - startTime,
  };
}
