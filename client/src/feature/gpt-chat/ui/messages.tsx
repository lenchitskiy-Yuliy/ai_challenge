import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { useUnit } from 'effector-react';
import type { MessagesModel } from '../model/messages';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GPTMessageMeta } from '#shared/lib/types';
import { convertMillisecondsToSeconds } from '#shared/lib/convert-milliseconds-to-seconds';

export interface MessagesProps {
  showMeta?: boolean;
}

export function Messages({ model, showMeta }: { model: MessagesModel } & MessagesProps) {
  const { messages } = useUnit({ messages: model.$messages });

  function renderMeta({
    executionDuration,
    spentTokens,
    completionTokens,
    promptTokens,
  }: GPTMessageMeta) {
    if (!executionDuration && !spentTokens) return null;

    return (
      <Box
        sx={{
          marginTop: 1,
        }}
      >
        {executionDuration && (
          <Typography variant="body2">
            Прошло времени: {convertMillisecondsToSeconds(executionDuration)} сек.
          </Typography>
        )}
        {promptTokens && (
          <Typography variant="body2">Потрачено токенов на запрос: {promptTokens}</Typography>
        )}
        {completionTokens && (
          <Typography variant="body2">Потрачено токенов на ответ: {completionTokens}</Typography>
        )}
        {spentTokens && (
          <Typography variant="body2">Всего потрачено токенов: {spentTokens}</Typography>
        )}
      </Box>
    );
  }

  return (
    <List sx={{ height: '100%', padding: 2 }}>
      {messages.map((message, index) => (
        <ListItem key={index}>
          <Box>
            <ListItemText
              primary={message.role === 'user' ? 'Вы' : 'AI'}
              secondary={<Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>}
              sx={{
                backgroundColor: message.role === 'user' ? '#e0f7fa' : '#f3e5f5',
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
