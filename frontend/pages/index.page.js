import React, { useContext } from 'react';
import SignerContext from './contexts/SignerContext';

export default function Home() {
  const signer = useContext(SignerContext);
  return (
    <>
      <h1 className="capitalize text-xl">News Dao</h1>
      <p>
        This will be the landing page. Go to Create profile to create and
        configure a lens profile for your dao. Go to proposals to create and
        approve post proposals. Don't forget to connect your wallet and switch
        to the mumbai testnet.
      </p>
    </>
  );
}
