import type { CreateFieldOptions } from './create-field';
import { createField } from './create-field';

export type StringFieldModel = ReturnType<typeof createStringField>;

export function createStringField(options?: CreateFieldOptions<string>) {
  const field = createField(options);

  return field;
}
