import { Stack } from '@chakra-ui/react';
import IconLink from '@components/misc/IconLink';
import React from 'react';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';

const UnauthenitcatedView = () => (
  <>
    <IconLink icon={FiLogIn}>Login</IconLink>
    <IconLink icon={FiUserPlus}>Register</IconLink>
  </>
);

const AuthenticatedView = () => (
  <>
    <IconLink icon={FiLogIn}>Username</IconLink>
  </>
);

const UserMenuInfoBar = ({}) => {
  const authenticated = false;

  return (
    <Stack
      className="info-bar"
      direction="row"
      spacing={4}
      paddingX={4}
      align="center"
      borderRightRadius="xl"
    >
      {authenticated ? <AuthenticatedView /> : <UnauthenitcatedView />}
    </Stack>
  );
};

export default UserMenuInfoBar;
