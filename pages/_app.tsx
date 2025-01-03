import Script from "next/script";
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({ subsets: ['latin'] });

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
    </>
  );
}

export default MyApp;
