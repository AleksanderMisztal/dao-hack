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
          <h1 className="text-red-500 capitalize">Proxy created!</h1>
          <p>Your proxy is now available at {proxyAddress}</p>
          <CreateProfile ownerAddress={proxyAddress} />
        </div>
      )}
    </div>
  );
}
