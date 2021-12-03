export const LightModeButtonTheme = {
  baseStyle: ({ colorMode }) => {
    const color = colorMode === 'dark' ? 'fg.100' : 'bg.700';
    const background = colorMode === 'dark' ? 'bg.800' : 'bg.50';
    const backgroundHover = colorMode === 'dark' ? 'bg.600' : 'bg.300';
    return {
      background,
      svg: {
        color,
        fill: colorMode === 'dark' ? 'fg.100' : 'fg.700',
      },
      _hover: { background: backgroundHover },
    };
  },
};
