import { IconButton } from '@chakra-ui/button';
import React from 'react';
import { Stack } from '@chakra-ui/layout';
import { FiCode, FiGrid, FiHelpCircle, FiHexagon, FiMenu } from 'react-icons/fi';
import { Menu, MenuButton, MenuGroup, MenuItem, MenuList } from '@chakra-ui/menu';

import UserMenuInfoBar from './UserMenuInfoBar';
import { useMultiStyleConfig } from '@chakra-ui/react';

const UserMenu = () => {
  const style = useMultiStyleConfig('UserMenuTheme', {});
  return (
    <Stack sx={style} direction="row" spacing={0} borderRadius="xl">
      <Menu isLazy>
        <MenuButton as={IconButton} icon={<FiMenu />} className="user-menu-button" fontSize="2xl" />
        <MenuList borderRadius="xl" className="user-menu-list">
          <MenuGroup title="Profile">
            <MenuItem icon={<FiHexagon size="24px" />}>My Account</MenuItem>
            <MenuItem icon={<FiGrid size="24px" />}>Dashboard</MenuItem>
          </MenuGroup>
          <MenuGroup title="Help">
            <MenuItem icon={<FiHelpCircle size="24px" />}>FAQ</MenuItem>
            <MenuItem icon={<FiCode size="24px" />}>API Documentation</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
      <UserMenuInfoBar />
    </Stack>
  );
};

UserMenu.defaultProps = { showInfoBar: true };

export default UserMenu;
