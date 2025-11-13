import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useUnit } from 'effector-react';
import type { Property } from 'csstype';
import type { MessagesModel } from '../model/messages';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GPTMessageMeta, GPTMessageRole } from '#shared/lib/types';
import { convertMillisecondsToSeconds } from '#shared/lib/convert-milliseconds-to-seconds';

export interface MessagesProps {
  showMeta?:
    | boolean
    | {
        executionDuration?: true;
        promptTokens?: true;
        completionTokens?: true;
        spentTokens?: true;
      };
}

export function Messages({ model, showMeta }: { model: MessagesModel } & MessagesProps) {
  const { messages } = useUnit({ messages: model.$messages });

  function renderMeta({
    executionDuration,
    spentTokens,
    completionTokens,
    promptTokens,
  }: GPTMessageMeta) {
    const texts: string[] = [];

    const showExecutionDuration =
      showMeta && executionDuration && (showMeta === true || 'executionDuration' in showMeta);

    const showPromptTokens =
      showMeta && promptTokens && (showMeta === true || 'promptTokens' in showMeta);

    const showCompletionTokens =
      showMeta && completionTokens && (showMeta === true || 'completionTokens' in showMeta);

    const showSpentTokens =
      showMeta && spentTokens && (showMeta === true || 'spentTokens' in showMeta);

    if (showExecutionDuration) {
      texts.push(` Прошло времени: ${convertMillisecondsToSeconds(executionDuration)} сек.`);
    }

    if (showPromptTokens) {
      texts.push(`Потрачено токенов на запрос: ${promptTokens}`);
    }

    if (showCompletionTokens) {
      texts.push(`Потрачено токенов на ответ: ${completionTokens}`);
    }

    if (showSpentTokens) {
      texts.push(`Всего потрачено токенов: ${spentTokens}`);
    }

    if (!texts.length) return null;

    return (
      <Box
        sx={{
          marginTop: 1,
        }}
      >
        {texts.map((text, index) => (
          <Typography variant="body2" key={index}>
            {text}
          </Typography>
        ))}
      </Box>
    );
  }

  const backgroundColors: Record<GPTMessageRole, Property.BackgroundColor> = {
    user: '#e0f7fa',
    assistant: '#f3e5f5',
    system: '#bfbfbfff',
  };

  const titles = {
    user: 'Вы',
    assistant: 'AI',
    system: 'Sys',
  };

  return (
    <List sx={{ height: '100%', padding: 2 }}>
      {messages
        .filter(({ role }) => role !== 'system')
        .map((message, index) => (
          <ListItem key={index}>
            <Box
              sx={{
                width: '100%',
              }}
            >
              <ListItemText
                primary={titles[message.role]}
                secondary={<Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>}
                sx={{
                  backgroundColor: backgroundColors[message.role],
                  borderRadius: 1,
                  padding: 1,
                  wordWrap: 'break-word',
                }}
              />

              {showMeta && message.meta && renderMeta(message.meta)}
            </Box>
          </ListItem>
        ))}
    </List>
  );
}
