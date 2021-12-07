import React from 'react';
import { Stack } from '@chakra-ui/react';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

import IconLink from '@components/misc/IconLink';

const UnauthenitcatedView = () => (
  <>
    <IconLink icon={FiLogIn}>Login</IconLink>
    <IconLink icon={FiUserPlus}>Register</IconLink>
  </>
);

const AuthenticatedView = () => <IconLink icon={FiLogIn}>Username</IconLink>;

const UserMenuInfoBar = () => {
  const authenticated = false;

  return (
    <Stack
      className="user-menu-info-bar"
      direction="row"
      spacing={4}
      paddingX={4}
      align="center"
      shadow="md"
    >
      {authenticated ? <AuthenticatedView /> : <UnauthenitcatedView />}
    </Stack>
  );
};

export default UserMenuInfoBar;
