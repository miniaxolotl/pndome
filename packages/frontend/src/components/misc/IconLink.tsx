import { Stack, Text, Link as ChakraLink } from '@chakra-ui/layout';
import { Icon, useMultiStyleConfig } from '@chakra-ui/react';
import React from 'react';

interface IconLinkProps {
  children: React.ReactNode;
  icon: React.FC;
}

const IconLink = (props: IconLinkProps) => {
  const { children, icon } = props;
  const { container } = useMultiStyleConfig('iconLinkStyle', props);

  return (
    <Stack as={ChakraLink} sx={container} direction="row" align="center" spacing={2}>
      <Text className="link-text">{children}</Text>
      <Icon className="link-icon" mx="1px" as={icon} />
    </Stack>
  );
};

export default IconLink;
