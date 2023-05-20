import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { ReactElement, ReactNode } from 'react';
import { NextPage } from 'next';

import { store } from './../app/store';

import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {

  const getLayout = Component.getLayout ?? (page => page)

  return <Provider store={store}>
    {getLayout(<Component {...pageProps} />)}
    <ToastContainer 
      position="bottom-right"
      autoClose={5000}
    />
  </Provider>
}

export default MyApp
