import { List, ListItem, ListItemText } from '@mui/material';
import { useUnit } from 'effector-react';
import { $messages } from '../model/store';

export function Dialog() {
  const { messages } = useUnit({ messages: $messages });

  return (
    <List sx={{ height: '100%', padding: 2 }}>
      {messages.map((message, index) => (
        <ListItem key={index}>
          <ListItemText
            primary={message.role === 'user' ? 'Вы' : 'AI'}
            secondary={message.text}
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
