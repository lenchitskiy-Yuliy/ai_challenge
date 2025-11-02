import { StringField } from '#shared/lib/fields';
import { Box, IconButton } from '@mui/material';
import { passwordField, submit, $disabelSubmit } from '../model/form';
import LoginIcon from '@mui/icons-material/Login';
import { useUnit } from 'effector-react';

export function Form() {
  const { onSubmit, disabelSubmit } = useUnit({
    onSubmit: submit,
    disabelSubmit: $disabelSubmit,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (disabelSubmit) return;

    onSubmit();
  }

  return (
    <Box
      component="form"
      sx={{ display: 'flex', alignItems: 'center', width: 400 }}
      onSubmit={handleSubmit}
    >
      <StringField label="Введите пароль" model={passwordField} type="password" />

      <IconButton type="submit" sx={{ p: 1, ml: 1 }} aria-label="search" disabled={disabelSubmit}>
        <LoginIcon />
      </IconButton>
    </Box>
  );
}
