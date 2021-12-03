import React from 'react';
import { Stack } from '@chakra-ui/layout';

import LightModeMenu from './LightModeButton';
import UserMenu from './UserMenu';

interface DesktopNavigationProps {
  children?: React.ReactNode;
}

const DesktopNavigation = ({ children }: DesktopNavigationProps) => {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      padding={8}
      className="desktop-navigation"
    >
      <UserMenu />
      {children}
      <LightModeMenu />
    </Stack>
  );
};

export default DesktopNavigation;
