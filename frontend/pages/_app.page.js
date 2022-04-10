import '../styles/globals.css';
import SignerContext from './contexts/SignerContext';

function MyApp({ Component, pageProps }) {
  return (
    <SignerContext>
      <Component {...pageProps} />
    </SignerContext>
  );
}

export default MyApp;
