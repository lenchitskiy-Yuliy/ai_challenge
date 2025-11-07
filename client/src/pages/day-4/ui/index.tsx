import { Layout } from '#shared/ui/layout';
import { GPTChat } from '#feature/gpt-chat';

import {
  firstGPTChatModel,
  secondGPTChatModel,
  thirdGPTChatModel,
  fourthGPTChatModel,
} from '../model/process';
import { Box, Stack, Typography } from '@mui/material';

export function Day4() {
  return (
    <Layout title="День четвертый">
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
          <Typography>Прямой ответ</Typography>
          <GPTChat model={firstGPTChatModel} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography>Пошаговое рассуждение</Typography>
          <GPTChat model={secondGPTChatModel} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography>Генерация лучшего промпта</Typography>
          <GPTChat model={thirdGPTChatModel} />
        </Box>

        <Box sx={{ width: '100%' }}>
          <Typography>Группа экспертов</Typography>
          <GPTChat model={fourthGPTChatModel} />
        </Box>
      </Stack>
    </Layout>
  );
}
