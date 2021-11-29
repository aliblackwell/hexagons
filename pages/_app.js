import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { Alert } from '@material-ui/lab';
import MainNavItems from '../components/navigation/MainNavItems';
import SettingNavItems from '../components/navigation/SettingNavItems';
import OrgPicker from '../components/navigation/OrgPicker';
import ResponsiveDrawer from '../components/navigation/ResponsiveDrawer';

import CustomSuspense from '../components/data-fetching/CustomSuspense';
import ErrorBoundary from '../components/data-fetching/ErrorBoundary';
import NextNprogress from 'nextjs-progressbar';
import CssBaseline from '@material-ui/core/CssBaseline';

import { create } from 'jss';
import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/core/styles';
import useGlobalStyles from '../styles/useGlobalStyles';
import templatePlugin from 'jss-plugin-template';
import nestedPlugin from 'jss-plugin-nested';
import theme from '../styles/theme';
import Loading from '../components/ui-globals/Loading';
import { useState } from 'react';
import { SkipNavLink, SkipNavContent } from '@reach/skip-nav';
import '@reach/skip-nav/styles.css';
import { AnimateSharedLayout } from 'framer-motion'; 
import Footer from '../components/layout/Footer';

// Data fetching
import { GraphQLClient } from 'graphql-request';
import { SWRConfig } from 'swr';
import { getOrgIdFromSession } from '../utils';

import { HexagonsContext } from '../components/data-fetching/HexagonsContext';
 

const isServer = typeof window === 'undefined';

const jss = create({
  plugins: [...jssPreset().plugins, templatePlugin(), nestedPlugin()],
});

function ThemeProviderWithGlobalStyles({ children }) {
  useGlobalStyles();
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

function MyApp({ Component, pageProps }) {
  const [loading, setLoading] = useState(false);
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    // WHY: https://stackoverflow.com/questions/63521538/removing-server-side-injected-css
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const headers = pageProps.user
    ? {
        headers: {
          Authorization: `Bearer ${pageProps.user.strapiToken}`,
        },
      }
    : {};

  const gqlClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, headers);

  const fetcher = async (query, variables) => {
    const data = await gqlClient.request(query, variables);
    return data;
  };
  let orgId = 0;
  if (pageProps.user) {
    orgId = getOrgIdFromSession(pageProps.user);
  }

  let role = 'public'
  if (pageProps.user) {
    role = pageProps.user.role.name
  }

   

  const hexagonsGlobals = {
    gqlClient,
    orgId,
    role
  };

 

  return (
    <>
      <Head>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <NextNprogress color={theme.palette.secondary.light} />
      <AnimateSharedLayout>
        <ThemeProviderWithGlobalStyles theme={theme}>
          <StylesProvider jss={jss}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <SkipNavLink />
            <SkipNavContent />
            <HexagonsContext.Provider value={hexagonsGlobals}>
              <ResponsiveDrawer
                {...pageProps}
                MainNavItems={MainNavItems}
                SettingNavItems={SettingNavItems}
                OrgPicker={OrgPicker}
              >
                <SWRConfig
                  {...pageProps}
                  value={{
                    refreshInterval: 0,
                    fetcher: fetcher,
                    revalidateOnFocus: false,
                    revalidateOnReconnect: false,
                  }}
                >
                  <div style={{ flexGrow: 1 }}>
                    {!isServer ? (
                      <ErrorBoundary
                        fallback={
                          <Alert severity="error">
                            Could not fetch data. Please check your connection.
                          </Alert>
                        }
                      >
                        <CustomSuspense message="Hexagonalising">
                          <Component {...pageProps} orgType setLoading={setLoading} />
                        </CustomSuspense>
                      </ErrorBoundary>
                    ) : (
                      <Loading message="Loading from server" />
                    )}
                  </div>

                  <Footer />
                </SWRConfig>
              </ResponsiveDrawer>
            </HexagonsContext.Provider>
          </StylesProvider>
        </ThemeProviderWithGlobalStyles>
      </AnimateSharedLayout>
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
