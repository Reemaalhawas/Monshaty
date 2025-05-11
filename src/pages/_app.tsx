import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { DataProvider } from '../contexts/DataContext';
import Navbar from '../components/Navbar';
import '../styles/tailwind.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <DataProvider>
      <Navbar />
      <Component {...pageProps} />
    </DataProvider>
  );
}

export default MyApp;