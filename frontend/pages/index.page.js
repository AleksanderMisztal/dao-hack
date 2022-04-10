import React, { useContext } from 'react';
import SignerContext from './contexts/SignerContext';

export default function Home() {
  const signer = useContext(SignerContext);
  return (
    <>
      <h1 className="text-red-500 capitalize">Hello friends</h1>
      <p>{signer}</p>
    </>
  );
}
