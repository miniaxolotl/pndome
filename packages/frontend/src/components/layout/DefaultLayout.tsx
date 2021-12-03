import { Box, Container } from '@chakra-ui/layout';
import { useMediaQuery, useMultiStyleConfig } from '@chakra-ui/react';
import DesktopNavigation from '@components/navigation/DesktopNavigation';
import MobileNavigation from '@components/navigation/MobileNavigation';
import React, { useState } from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: DefaultLayoutProps) => {
  const { children } = props;

  const { navigation } = useMultiStyleConfig('defaultLayoutStyle', props);

  return (
    <Box sx={navigation}>
      <DesktopNavigation>{children}</DesktopNavigation>
      <MobileNavigation>{children}</MobileNavigation>

      <Container maxWidth="full" paddingX={[4, 8]}>
        {children}
      </Container>
    </Box>
  );
};

export default DefaultLayout;
