import React from 'react';
import { useState } from 'react';
import { shortenAddress } from '../../lib/utils';
import { ethers } from 'ethers';
import Button from './Button';

export const AddressSelect = ({ onSignerObtained }) => {
  const [address, setAddress] = useState(undefined);
  const getSigner = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const balance = await signer.getBalance();

    console.log({ balance: ethers.utils.formatEther(balance) });
    console.log({ address });

    setAddress(address);
    onSignerObtained(signer);
  };

  return (
    <>
      <Button className="absolute right-4 top-0" onClick={getSigner}>
        {address === undefined ? (
          'Connect wallet'
        ) : (
          <>
            {shortenAddress(address)}
            <br />
            {window.ethereum.networkVersion === '80001'
              ? 'Mumbai'
              : 'Please change to Mumbai'}
          </>
        )}
      </Button>
    </>
  );
};
