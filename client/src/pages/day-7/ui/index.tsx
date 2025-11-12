import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import { firstGPTChatModel, secondGPTChatModel, thirdGPTChatModel } from '../model/process';
import { Box, Stack } from '@mui/material';

export function Day7() {
  return (
    <Layout title="День седьмой">
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'stretch',
          minHeight: '100%',
        }}
      >
        <Box sx={{ width: '100%' }}>
          <GPTChat model={firstGPTChatModel} messagesProps={{ showMeta: true }} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <GPTChat model={secondGPTChatModel} messagesProps={{ showMeta: true }} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <GPTChat model={thirdGPTChatModel} messagesProps={{ showMeta: true }} />
        </Box>
      </Stack>
    </Layout>
  );
}
