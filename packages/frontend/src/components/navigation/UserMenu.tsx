import { FiMenu } from 'react-icons/fi';
import { IconButton } from '@chakra-ui/button';
import React from 'react';
import { Stack } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuDivider, MenuGroup, MenuItem, MenuList } from '@chakra-ui/menu';

import UserMenuInfoBar from './UserMenuInfoBar';
import { useMultiStyleConfig } from '@chakra-ui/react';

interface UserMenuProps {
  showInfoBar?: boolean;
}

const UserMenu = ({ showInfoBar }: UserMenuProps) => {
  const style = useMultiStyleConfig('UserMenuTheme', {});
  return (
    <Stack sx={style} direction="row" spacing={0} borderRadius="xl" shadow="md">
      <Menu isLazy>
        <MenuButton
          as={IconButton}
          icon={<FiMenu />}
          className="user-menu-button"
          borderRightRadius={showInfoBar ? 0 : 'xl'}
          fontSize="2xl"
          borderLeftRadius="xl"
        />
        <MenuList borderRadius="xl" className="user-menu-list" fontSize="lg">
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
