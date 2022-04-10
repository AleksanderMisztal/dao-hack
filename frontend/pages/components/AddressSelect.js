import React from 'react';
import { useState } from 'react';
import { shortenAddress } from '../../lib/utils';
import { ethers } from 'ethers';

export const AddressSelect = ({ onAddressSelected }) => {
  const [address, setAddress] = useState(undefined);
  console.log('address select');
  const getSigner = async () => {
    console.log('getSigner');
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    setAddress(address);
    console.log('Account:', address);
    onAddressSelected(address);
  };

  return (
    <>
      <button
        className="absolute right-4 top-0 bg-blue-400 p-3 rounded-lg border-orange-500 border-2"
        onClick={getSigner}
      >
        {address === undefined ? 'Connect wallet' : shortenAddress(address)}
      </button>
    </>
  );
};
