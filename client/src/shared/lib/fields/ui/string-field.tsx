import { useUnit } from 'effector-react';
import type { ChangeEvent } from 'react';

import type { StringFieldModel } from '../models/create-string-field';
import { TextField, type TextFieldProps } from '@mui/material';

interface StringFieldProps
  extends Pick<TextFieldProps, 'label' | 'type' | 'fullWidth' | 'multiline' | 'minRows'> {
  model: StringFieldModel;
}

export function StringField({ model, ...props }: StringFieldProps) {
  const { value, reset, onChange, invalid, isDisabled, isHidden, required } = useUnit({
    value: model.$value,
    reset: model.resetValue,
    onChange: model.setValue,
    invalid: model.$isInvalid,
    isDisabled: model.$isDisabled,
    isHidden: model.$isHidden,
    required: model.$required,
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value) {
      onChange(event.target.value);
    } else {
      reset();
    }
  }

  if (isHidden) return null;

  return (
    <TextField
      variant="outlined"
      value={value === null ? '' : value}
      error={invalid}
      onChange={handleChange}
      placeholder="Введите значение"
      disabled={isDisabled}
      required={required}
      fullWidth
      {...props}
    />
  );
}
