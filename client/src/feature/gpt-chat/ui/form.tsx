import { StringField } from '#shared/lib/fields';
import { Box, CircularProgress, IconButton } from '@mui/material';

import SendIcon from '@mui/icons-material/Send';
import type { FormModel } from '../model/form';
import { useUnit } from 'effector-react';

export function Form({ model }: { model: FormModel }) {
  const { onSubmit, disabelSubmit, submiting } = useUnit({
    onSubmit: model.submit,
    disabelSubmit: model.$disabelSubmit,
    submiting: model.$submiting,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabelSubmit) return;

    onSubmit();
  }

  return (
    <Box
      component="form"
      sx={{ display: 'flex', alignItems: 'center', width: '100%' }}
      onSubmit={handleSubmit}
    >
      <StringField
        multiline
        label="Введите значение"
        disabled={submiting}
        model={model.promptField}
      />

      <IconButton
        type="submit"
        sx={{ p: 1, ml: 1, width: 40 }}
        aria-label="submit"
        disabled={disabelSubmit}
      >
        {submiting ? (
          <CircularProgress color="info" size="20px" />
        ) : (
          <SendIcon color={disabelSubmit ? 'disabled' : 'primary'} />
        )}
      </IconButton>
    </Box>
  );
}
