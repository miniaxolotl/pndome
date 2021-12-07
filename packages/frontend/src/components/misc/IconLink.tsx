import React from 'react';

import { Link as ChakraLink, Stack, Text } from '@chakra-ui/layout';
import { Icon, useMultiStyleConfig } from '@chakra-ui/react';

interface IconLinkProps {
  children: React.ReactNode;
  icon: React.FC;
}

const IconLink = (props: IconLinkProps) => {
  const { children, icon } = props;
  const style = useMultiStyleConfig('IconLinkTheme', props);

  return (
    <Stack as={ChakraLink} sx={style} direction="row" align="center" spacing={2}>
      <Text className="link-text">{children}</Text>
      <Icon className="link-icon" mx="2px" as={icon} />
    </Stack>
  );
};

export default IconLink;
