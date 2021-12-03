export const DefaultLayoutTheme = {
  baseStyle: () => {
    return {
      navigation: {
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
    };
  },
};
