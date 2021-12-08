import React from 'react';
import { useMultiStyleConfig } from '@chakra-ui/react';
import { Box, Container } from '@chakra-ui/layout';

import DesktopNavigation from 'components/navigation/DesktopNavigation';
import MobileNavigation from 'components/navigation/MobileNavigation';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const DefaultLayout = (props: DefaultLayoutProps) => {
  const { children } = props;

  const { navigation } = useMultiStyleConfig('DefaultLayoutTheme', {});

  return (
    <Box sx={navigation}>
      <DesktopNavigation />
      <MobileNavigation />

      <Container maxWidth="full" paddingX={[4, 8]}>
        {children}
      </Container>
    </Box>
  );
};

export default DefaultLayout;
