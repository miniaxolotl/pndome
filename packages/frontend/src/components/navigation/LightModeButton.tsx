import { FiMoon } from 'react-icons/fi';
import { IconButton } from '@chakra-ui/button';
import { useColorMode, useMultiStyleConfig } from '@chakra-ui/react';

import React from 'react';

const LightModeButton = () => {
  const { toggleColorMode } = useColorMode();
  const style = useMultiStyleConfig('LightModeButtonTheme', {});
  return (
    <IconButton
      sx={style}
      icon={<FiMoon />}
      onClick={toggleColorMode}
      aria-label="light-mode"
      borderRadius="xl"
    />
  );
};

export default LightModeButton;
