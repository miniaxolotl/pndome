import { Box, Stack } from '@chakra-ui/layout';
import { Image } from '@chakra-ui/react';
import React from 'react';
import LightModeMenu from './LightModeButton';
import UserMenu from './UserMenu';

interface MobileNavigationProps {
  children: React.ReactNode;
}

const MobileNavigation = ({ children }: MobileNavigationProps) => {
  return (
    <Stack direction="row" justifyContent="space-between" padding={4} className="mobile-navigation">
      <UserMenu showInfoBar={false} />
      <LightModeMenu />
    </Stack>
  );
};

export default MobileNavigation;
