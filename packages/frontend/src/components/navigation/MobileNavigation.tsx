import React from 'react';
import { Stack } from '@chakra-ui/layout';

import LightModeMenu from './LightModeButton';
import UserMenu from './UserMenu';
import UserMenuInfoBar from './UserMenuInfoBar';
import { useMultiStyleConfig } from '@chakra-ui/system';

const MobileNavigation = () => {
  const style = useMultiStyleConfig('UserMenuTheme', {});

  return (
    <Stack direction="row" justifyContent="space-between" padding={4} className="mobile-navigation">
      <UserMenu />
      <UserMenuInfoBar />
      <LightModeMenu />
    </Stack>
  );
};

export default MobileNavigation;
