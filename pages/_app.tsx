import { QueryClient, QueryClientProvider } from 'react-query';
import '@/app/globals.css';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <title>TENKI 7</title>
        <meta property='og:title' content='TENKI 7' key='title' />
        <link rel='icon' href='/images/favicon.ico' type='image/x-icon' />
      </Head>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp);
