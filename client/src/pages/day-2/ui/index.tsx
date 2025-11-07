import { Layout } from '#shared/ui/layout';
import { JsonSchema } from '#feature/json-schema';
import { GPTChat } from '#feature/gpt-chat';

import { GPTChatModel } from '../model/process';
import { Stack } from '@mui/material';

export function Day2() {
  return (
    <Layout title="День второй">
      <Stack
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <JsonSchema />
        <GPTChat model={GPTChatModel} />
      </Stack>
    </Layout>
  );
}
