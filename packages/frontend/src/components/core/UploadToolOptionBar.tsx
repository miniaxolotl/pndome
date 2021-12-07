import React from 'react';
import { Container, Stack } from '@chakra-ui/layout';
import { FiEye, FiEyeOff, FiKey, FiLock, FiTrash, FiUnlock, FiUpload } from 'react-icons/fi';
import { IconButton, Input } from '@chakra-ui/react';

const UploadToolOptionBar = () => {
  return (
    <Container maxW="xl">
      <Stack className="upload-tool-bar" direction="row" spacing={0} justifyContent="space-between">
        <IconButton aria-label="upload" className="upload-button" icon={<FiUpload />} />
        <Stack direction="row" spacing={0} className="upload-tool-button-group">
          <IconButton aria-label="private-button" className="private-button" icon={<FiUnlock />} />
          <IconButton
            aria-label="anonymous-button"
            className="anonymous-button"
            icon={<FiEyeOff />}
          />
          <Stack direction="row" spacing={0} className="password-input-group">
            {/* <Input type="password" className="password-input" /> */}
            <IconButton aria-label="password-button" className="password-button" icon={<FiKey />} />
          </Stack>
          {/* <IconButton aria-label="trash" className="trash-button" icon={<FiTrash />} /> */}
        </Stack>
      </Stack>
    </Container>
  );
};

export default UploadToolOptionBar;
