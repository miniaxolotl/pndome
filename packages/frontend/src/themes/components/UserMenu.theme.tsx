export const UserMenuTheme = {
  baseStyle: ({ colorMode }) => {
    const color = colorMode === 'dark' ? 'fg.100' : 'bg.700';
    const brand = colorMode === 'dark' ? 'brand.600' : 'brand.300';
    const background = colorMode === 'dark' ? 'bg.800' : 'bg.50';
    const backgroundHover = colorMode === 'dark' ? 'brand.500' : 'brand.500';
    const backgroundActive = colorMode === 'dark' ? 'brand.300' : 'brand.600';
    return {
      '.user-menu-button': {
        background: brand,
        svg: {
          color,
        },
        _hover: {
          background: backgroundHover,
        },
        _active: {
          background: backgroundActive,
        },
      },
      '.user-menu-info-bar': {
        color,
        background,
        svg: {
          color,
        },
      },
      '.user-menu-list': {
        background,
        p: {
          fontWeight: 'bold',
          color: brand,
        },
        button: {
          _hover: {
            background: colorMode === 'dark' ? 'bg.700' : 'bg.200',
          },
          _active: {
            background: colorMode === 'dark' ? 'bg.600' : 'bg.300',
          },
        },
      },
      '.mobile-navigation': {
        display: 'none',
      },
      '@media only screen and (max-width: 480px)': {
        '.desktop-navigation': {
          display: 'none',
        },
        '.mobile-navigation': {
          display: 'flex',
        },
      },
    };
  },
};
