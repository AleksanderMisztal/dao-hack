import React, { useState } from 'react';
import { AddressSelect } from '../components/AddressSelect';

const _SignerContext = React.createContext(undefined);

export default function SignerContext({ children }) {
  const [signer, setSigner] = useState(undefined);
  return (
    <div className="relative">
      <AddressSelect onAddressSelected={setSigner} />
      <_SignerContext.Provider value={signer}>
        {children}
      </_SignerContext.Provider>
    </div>
  );
}
