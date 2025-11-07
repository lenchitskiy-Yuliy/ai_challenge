import { List, ListItem, ListItemText } from '@mui/material';
import { useUnit } from 'effector-react';
import type { MessagesModel } from '../model/messages';

import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Messages({ model }: { model: MessagesModel }) {
  const { messages } = useUnit({ messages: model.$messages });

  return (
    <List sx={{ height: '100%', padding: 2 }}>
      {messages.map((message, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={message.role === 'user' ? 'Вы' : 'AI'}
            secondary={
              <>
                <Markdown remarkPlugins={[remarkGfm]}>{message.text}</Markdown>
              </>
            }
            sx={{
              backgroundColor: message.role === 'user' ? '#e0f7fa' : '#f3e5f5',
              borderRadius: 1,
              padding: 1,
              wordWrap: 'break-word',
            }}
          />
        </ListItem>
      ))}
    </List>
  );
}
