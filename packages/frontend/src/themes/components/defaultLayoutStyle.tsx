const background = 'brand2.100';
const backgroundHover = 'brand2.700';

const color = 'brand2.400';
const colorHover = 'brand2.700';

const accent = 'brand.100';

export const defaultLayoutStyle = {
  // The parts of the component
  parts: ['navigation'],
  // The base styles for each part
  baseStyle: {
    navigation: {
      a: {
        color: color,
        _hover: {
          color: colorHover,
        },
      },
      '.menu-icon': {
        color: accent,
      },
      '.light-mode-button': {
        background: background,
        svg: {
          fill: color,
          color: color,
        },
        _hover: {
          background: backgroundHover,
        },
      },
      '.info-bar': {
        background: background,
      },
      '.desktop-navigation': {
        display: 'flex',
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
    },
  },
  // The size styles for each part
  sizes: {},
  // The variant styles for each part
  variants: {},
  // The default `size` or `variant` values
  defaultProps: {},
};
