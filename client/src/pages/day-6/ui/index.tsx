import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import { firstGPTChatModel, secondGPTChatModel, thirdGPTChatModel } from '../model/process';
import { Box, Link, Stack, Typography } from '@mui/material';

export function Day6() {
  return (
    <Layout title="День шестой">
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
          <Typography>
            Модель:{' '}
            <Link href="https://huggingface.co/openai/gpt-oss-safeguard-20b" target="_blank">
              openai/gpt-oss-safeguard-20b
            </Link>
          </Typography>
          <GPTChat model={firstGPTChatModel} messagesProps={{ showMeta: true }} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography>
            Модель:{' '}
            <Link href="https://huggingface.co/Qwen/Qwen3-235B-A22B-Thinking-2507" target="_blank">
              Qwen/Qwen3-235B-A22B-Thinking-2507
            </Link>
          </Typography>
          <GPTChat model={secondGPTChatModel} messagesProps={{ showMeta: true }} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography>
            Модель:{' '}
            <Link href="https://huggingface.co/baidu/ERNIE-4.5-300B-A47B-Base-PT" target="_blank">
              baidu/ERNIE-4.5-300B-A47B-Base-PT
            </Link>
          </Typography>
          <GPTChat model={thirdGPTChatModel} messagesProps={{ showMeta: true }} />
        </Box>
      </Stack>
    </Layout>
  );
}
