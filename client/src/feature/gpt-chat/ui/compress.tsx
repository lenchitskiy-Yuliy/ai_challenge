import { Button } from '@mui/material';
import type { CompressModel } from '../model/compress';
import { useUnit } from 'effector-react';

export function GPTCompress({ model }: { model: CompressModel }) {
  const { compress, disabled, loading } = useUnit({
    compress: model.triggerCompress,
    disabled: model.$disabled,
    loading: model.$compressLoading,
  });

  return (
    <Button onClick={compress} disabled={disabled} loading={loading}>
      Сжать диалог
    </Button>
  );
}
