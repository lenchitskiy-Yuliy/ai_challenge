import { Messages, type MessagesProps } from './messages';
import { Form } from './form';

import '../model/chat';
import { Box, Button } from '@mui/material';
import type { GPTChatModel } from '../model/chat';
import { GPTCompress } from './compress';
import { useUnit } from 'effector-react';

export function GPTChat({
  model,
  messagesProps = {},
  canClear,
}: {
  model: GPTChatModel;
  messagesProps?: MessagesProps;
  canClear?: boolean;
}) {
  const { onClear, disabledClear } = useUnit({
    onClear: model.clearChat,
    disabledClear: model.$disabledClearChat,
  });

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      {model.compressModel && <GPTCompress model={model.compressModel} />}
      {canClear && (
        <Button onClick={onClear} disabled={disabledClear}>
          Очистить диалог
        </Button>
      )}

      <Box sx={{ flexGrow: 1, paddingBottom: 10 }}>
        <Messages model={model.messagesModel} {...messagesProps} />
      </Box>

      <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: 'white' }}>
        <Form model={model.formModel} />
      </Box>
    </Box>
  );
}
