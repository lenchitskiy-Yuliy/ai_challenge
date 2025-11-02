import { Dialog } from './dialog';
import { Form } from './form';

import '../model/process';
import { Box } from '@mui/material';

export function SimpleChat() {
  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ flexGrow: 1, paddingBottom: 10 }}>
        <Dialog />
      </Box>

      <Box sx={{ position: 'fixed', bottom: 20, left: 20, right: 20, backgroundColor: 'white' }}>
        <Form />
      </Box>
    </Box>
  );
}
