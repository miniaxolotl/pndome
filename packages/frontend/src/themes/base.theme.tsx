import { ThemeConfig, extendTheme } from '@chakra-ui/react';

import { DefaultLayoutTheme } from '@themes/components/DefaultLayout.theme';
import { LightModeButtonTheme } from './components/LightModeButton.theme';
import { UserMenuTheme } from './components/UserMenu.theme';
import { iconLinkStyle } from '@themes/components/iconLinkStyle';

export const colors = {
  sky: {
    50: '#e6f6fa',
    100: '#c9e0e8',
    200: '#a9cad7',
    300: '#87b5c7',
    400: '#67a1b7',
    500: '#4e879d',
    600: '#3c697b',
    700: '#2a4c58',
    800: '#172d36',
    900: '#011016',
  },
  mint: {
    50: '#e1fcea',
    100: '#bfeed1',
    200: '#9ae3b7',
    300: '#74d69f',
    400: '#4fca89',
    500: '#35b073',
    600: '#268953',
    700: '#186235',
    800: '#0a3c1a',
    900: '#001602',
  },
  blush: {
    50: '#ffe9f3',
    100: '#efc3d4',
    200: '#e29cbb',
    300: '#d675a8',
    400: '#ca4f96',
    500: '#b03686',
    600: '#89296e',
    700: '#621d54',
    800: '#3c1037',
    900: '#180317',
  },
  storm: {
    50: '#f1f1f9',
    100: '#d4d4de',
    200: '#b7b8c6',
    300: '#9a9dad',
    400: '#7d8296',
    500: '#646b7e',
    600: '#4e5562',
    700: '#373d46',
    800: '#21262b',
    900: '#0b0f13',
  },
  grey: {
    50: '#f2f2f2',
    100: '#d9d9d9',
    200: '#bfbfbf',
    300: '#a6a6a6',
    400: '#8c8c8c',
    500: '#737373',
    600: '#595959',
    700: '#404040',
    800: '#262626',
    900: '#0d0d0d',
  },
};

const themeColors = {
  brand: {
    50: colors.mint[50],
    100: colors.mint[100],
    200: colors.mint[200],
    300: colors.mint[300],
    500: colors.mint[500],
    600: colors.mint[600],
    700: colors.mint[700],
    800: colors.mint[800],
  },
  alt: {
    50: colors.sky[50],
    100: colors.sky[100],
    200: colors.sky[200],
    300: colors.sky[300],
    500: colors.sky[500],
    600: colors.sky[600],
    700: colors.sky[700],
    800: colors.sky[800],
  },
  accent: {
    50: colors.blush[50],
    100: colors.blush[100],
    200: colors.blush[200],
    300: colors.blush[300],
    500: colors.blush[500],
    600: colors.blush[600],
    700: colors.blush[700],
    800: colors.blush[800],
  },
  bg: {
    50: colors.storm[50],
    100: colors.storm[100],
    200: colors.storm[200],
    300: colors.storm[300],
    500: colors.storm[500],
    600: colors.storm[600],
    700: colors.storm[700],
    800: colors.storm[800],
  },
  fg: {
    50: colors.grey[50],
    100: colors.grey[100],
    200: colors.grey[200],
    300: colors.grey[300],
    500: colors.grey[500],
    600: colors.grey[600],
    700: colors.grey[700],
    800: colors.grey[800],
  },
};

export const baseTheme: ThemeConfig = extendTheme({
  components: {
    DefaultLayoutTheme,
    LightModeButtonTheme,
    UserMenuTheme,
    iconLinkStyle,
  },
  styles: {
    global: {
      a: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
  colors: {
    ...colors,
    ...themeColors,
  },
});
