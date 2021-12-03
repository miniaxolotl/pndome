import { IconButton } from '@chakra-ui/button';
import { Stack, Link as ChakraLink } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/menu';
import { FiMenu, FiMoon } from 'react-icons/fi';

import React from 'react';
import { useTheme } from '@chakra-ui/system';

interface LightModeButtonProps {}

const LightModeButton = (props: LightModeButtonProps) => {
  return (
    <IconButton
      shadow="lg"
      icon={<FiMoon />}
      colorScheme="brand2"
      borderRadius="xl"
      background="background.100"
      className="light-mode-button"
      aria-label="light-mode"
    />
  );
};

export default LightModeButton;
