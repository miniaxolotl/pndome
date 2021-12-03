import React from 'react';
import { Box, Flex, Image } from '@chakra-ui/react';

interface BannerMastheadProps {
  children?: React.ReactNode;
}

const BannerMasthead = (props: BannerMastheadProps) => {
  return (
    <Box>
      <Flex justifyContent="center">
        <Image
          src="/banner.svg"
          height="160px"
          alt="Logo"
          style={{ filter: 'drop-shadow(2px 2px 4px #000)' }}
        />
      </Flex>
    </Box>
  );
};

export default BannerMasthead;
