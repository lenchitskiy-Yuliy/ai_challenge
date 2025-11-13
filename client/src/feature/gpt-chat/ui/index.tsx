import { Messages, type MessagesProps } from './messages';
import { Form } from './form';

import '../model/chat';
import { Box } from '@mui/material';
import type { GPTChatModel } from '../model/chat';
import { GPTCompress } from './compress';

export function GPTChat({
  model,
  messagesProps = {},
}: {
  model: GPTChatModel;
  messagesProps?: MessagesProps;
}) {
  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      {model.compressModel && <GPTCompress model={model.compressModel} />}

      <Box sx={{ flexGrow: 1, paddingBottom: 10 }}>
        <Messages model={model.messagesModel} {...messagesProps} />
      </Box>

      <Box sx={{ position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: 'white' }}>
        <Form model={model.formModel} />
      </Box>
    </Box>
  );
}
