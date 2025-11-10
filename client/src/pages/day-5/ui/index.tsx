import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import { firstGPTChatModel, secondGPTChatModel, thirdGPTChatModel } from '../model/process';
import { Box, Stack, Typography } from '@mui/material';

export function Day5() {
  return (
    <Layout title="День пятый">
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
          <Typography>Температура: 0</Typography>
          <GPTChat model={firstGPTChatModel} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography>Температура: 0.5</Typography>
          <GPTChat model={secondGPTChatModel} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography>Температура: 1.0</Typography>
          <GPTChat model={thirdGPTChatModel} />
        </Box>
      </Stack>
    </Layout>
  );
}
