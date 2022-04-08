import React, { useEffect } from 'react';
import { AddressSelect } from './components/AddressSelect';

export default function Home() {
  const onAddressChanged = console.log;

  return (
    <>
      <h1 className="text-red-500 capitalize">Hello friends</h1>
      <AddressSelect onAddressSelected={onAddressChanged} />
    </>
  );
}
