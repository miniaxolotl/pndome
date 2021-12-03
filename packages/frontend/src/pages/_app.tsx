import type { AppProps } from 'next/app';
import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { defaultLayoutStyle } from '@themes/components/defaultLayoutStyle';
import { iconLinkStyle } from '@themes/components/iconLinkStyle';

const theme = extendTheme({
  components: {
    defaultLayoutStyle,
    iconLinkStyle,
  },
  baseStyles: {},
  styles: {
    global: {
      body: {
        bg: 'background.100',
      },
      a: {
        textDecoration: 'none',
        _hover: {
          textDecoration: 'none',
        },
      },
    },
  },
  colors: {
    // soft blue
    brand: {
      100: '#E9F2F5',
      400: '#0eaff2',
      500: '#33bbf4',
      600: '#0ca1e0',
      700: '#075e83',
      900: '#032939',
    },
    // mint green
    brand2: {
      100: '#c0efde',
      400: '#648C7E',
      500: '#486E61',
      600: '#51786A',
      700: '#2C5043',
      900: '#183B2E',
    },
    // light pink
    accent: {
      100: '#f3c7d8',
    },
    // grey
    background: {
      100: '#FCFAF6',
      200: '#FBF3EC',
      300: '#F9ECE2',
      400: '#F5DDCD',
      500: '#EDC0A4',
      600: '#E9B290',
      700: '#E5A37B',
      900: '#DD8551',
    },
  },
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default MyApp;
