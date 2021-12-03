import { IconButton } from '@chakra-ui/button';
import { Stack, Link as ChakraLink } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/menu';
import { FiLogIn, FiMenu, FiUser, FiUserPlus } from 'react-icons/fi';

import React from 'react';
import UserMenuInfoBar from './UserMenuInfoBar';

interface UserMenuProps {
  showInfoBar?: boolean;
}

const UserMenu = ({ showInfoBar }: UserMenuProps) => {
  return (
    <Stack direction="row" spacing={0} borderRadius="xl" shadow="lg">
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          icon={<FiMenu />}
          className="menu-icon"
          colorScheme="brand"
          borderRightRadius={showInfoBar ? 0 : 'xl'}
          borderLeftRadius="xl"
        />
        <MenuList borderRadius="xl">
          <MenuGroup title="Profile">
            <MenuItem>My Account</MenuItem>
            <MenuItem>Payments </MenuItem>
          </MenuGroup>
          <MenuDivider />
          <MenuGroup title="Help">
            <MenuItem>Docs</MenuItem>
            <MenuItem>FAQ</MenuItem>
          </MenuGroup>
        </MenuList>
        {showInfoBar ? <UserMenuInfoBar /> : null}
      </Menu>
    </Stack>
  );
};

UserMenu.defaultProps = { showInfoBar: true };

export default UserMenu;
