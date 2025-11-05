import { Box, Button, CardContent, Typography } from '@mui/material';
import { StringField } from '#shared/lib/fields';
import { $disableSubmit, $status, shemaField, submit } from '../model/form';
import { useUnit } from 'effector-react';
import type { Status } from '../lib/type';
import { $errorMessage } from '../model/validate';

export function JsonSchema() {
  const { disableSubmit, onSubmit, status, errorMessage } = useUnit({
    status: $status,
    onSubmit: submit,
    disableSubmit: $disableSubmit,
    errorMessage: $errorMessage,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disableSubmit) return;

    onSubmit();
  }

  const topStatus: Record<
    Status,
    {
      text: string;
      color: string;
    } | null
  > = {
    success: {
      text: 'Схема применена',
      color: 'success',
    },
    error: {
      text: errorMessage,
      color: 'error',
    },
    none: {
      text: 'Введите JSON Schema:',
      color: 'secondary',
    },
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          {topStatus[status] && (
            <Typography variant="body1" sx={{ flexGrow: 1 }} color={topStatus[status].color}>
              {topStatus[status].text}
            </Typography>
          )}
        </Box>

        <StringField label="JSON Schema" minRows={10} multiline model={shemaField} />

        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Button type="submit" variant="contained" disabled={disableSubmit}>
            Применить
          </Button>
        </Box>
      </CardContent>
    </Box>
  );
}
