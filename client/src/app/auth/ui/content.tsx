import { Box } from '@mui/material';
import type { JSX } from 'react';

export function Content({ children }: { children: JSX.Element }) {
  return (
    <Box sx={{ height: '100%', width: '100%', display: 'grid', placeItems: 'center' }}>
      {children}
    </Box>
  );
}
