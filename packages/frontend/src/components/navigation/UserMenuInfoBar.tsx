import React from 'react';
import { Stack } from '@chakra-ui/react';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

import IconLink from 'components/misc/IconLink';
import { useState } from 'stores/StateProvider';

const UnauthenitcatedView = () => (
  <>
    <IconLink icon={FiLogIn}>Login</IconLink>
    <IconLink icon={FiUserPlus}>Register</IconLink>
  </>
);

const AuthenticatedView = () => <IconLink icon={FiLogIn}>Username</IconLink>;

const UserMenuInfoBar = () => {
  const authentication = useState('authentication');

  return (
    <Stack className="user-menu-info-bar" direction="row" spacing={4} paddingX={4} align="center">
      {authentication.token ? <AuthenticatedView /> : <UnauthenitcatedView />}
    </Stack>
  );
};

export default UserMenuInfoBar;
