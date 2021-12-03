import React from 'react';
import { Stack } from '@chakra-ui/layout';

import LightModeMenu from './LightModeButton';
import UserMenu from './UserMenu';

interface MobileNavigationProps {
  children?: React.ReactNode;
}

const MobileNavigation = ({ children }: MobileNavigationProps) => {
  return (
    <Stack direction="row" justifyContent="space-between" padding={4} className="mobile-navigation">
      <UserMenu showInfoBar={false} />
      {children}
      <LightModeMenu />
    </Stack>
  );
};

export default MobileNavigation;
