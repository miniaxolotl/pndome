import React from 'react';
import { Stack } from '@chakra-ui/layout';
import { useMultiStyleConfig } from '@chakra-ui/react';

import UploadToolOptionBar from './UploadToolOptionBar';

interface UploadToolProps {
  children?: React.ReactNode;
}

const UploadTool = (props: UploadToolProps) => {
  const { children } = props;
  const style = useMultiStyleConfig('UploadToolTheme', props);

  return (
    <Stack sx={style} direction="column" spacing={2}>
      <UploadToolOptionBar />
      {children}
    </Stack>
  );
};

export default UploadTool;
