import React from 'react';
import App, { AppContext, AppProps } from 'next/app';

import { ChakraSSR } from './_chakra';

const MyApp = ({ Component, pageProps, cookies }: AppProps & { cookies }) => {
  return (
    <ChakraSSR cookies={cookies}>
      <Component {...pageProps} />
    </ChakraSSR>
  );
};

MyApp.getInitialProps = async (context: AppContext) => {
  const appProps = await App.getInitialProps(context);
  const { req } = context.ctx;

  return {
    ...appProps,
    cookies: req?.headers.cookie ?? '',
  };
};

export default MyApp;
