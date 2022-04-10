import React, { useState } from 'react';
import fs from 'fs';
import DeployProxy from './components/DeployProxy';
import CreateProfile from './components/CreateProfile';

export const getStaticProps = async () => {
  const modules = fs.readFileSync('./public/modules.json');
  return {
    props: {
      modules: JSON.parse(modules),
    },
  };
};

export default function CreateDAOProfile({ modules }) {
  const [proxyAddress, setProxyAddress] = useState(undefined);

  return (
    <div>
      {!proxyAddress ? (
        <DeployProxy modules={modules} onProxyCreated={setProxyAddress} />
      ) : (
        <div className="">
          <p>
            Your proxy is now available at{' '}
            <span className="bg-blue-100 p-1">{proxyAddress}</span>
          </p>
          You can now create a profile with your proxy address, or transfer the
          ownership of an existing profile to this address.
          <CreateProfile ownerAddress={proxyAddress} />
        </div>
      )}
    </div>
  );
}
