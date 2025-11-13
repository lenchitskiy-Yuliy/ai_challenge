import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import { GPTChatModel } from '../model/process';
import { Box, Stack } from '@mui/material';

export function Day8() {
  return (
    <Layout title="День восьмой">
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
          <GPTChat
            model={GPTChatModel}
            messagesProps={{
              showMeta: {
                spentTokens: true,
              },
            }}
          />
        </Box>
      </Stack>
    </Layout>
  );
}
