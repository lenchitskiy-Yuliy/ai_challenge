import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import { GPTChatModel, mount } from '../model/process';
import { Box, Stack } from '@mui/material';
import { useUnit } from 'effector-react';
import { useEffect } from 'react';

export function Day9() {
  const { onMount } = useUnit({ onMount: mount });

  useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <Layout title="День девятый">
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
          <GPTChat model={GPTChatModel} canClear />
        </Box>
      </Stack>
    </Layout>
  );
}
