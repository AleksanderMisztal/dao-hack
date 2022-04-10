import React, { useContext } from 'react';
import fs from 'fs';
import { fetchJson } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import SignerContext from './contexts/SignerContext';
export const getStaticProps = async () => {
  const modules = fs.readFileSync('./public/modules.json');
  return {
    props: {
      modules: JSON.parse(modules),
    },
  };
};

export default function CreateProfile({ modules }) {
  const [selectedModules, setSelectedModules] = React.useState(
    modules.map((m) => false)
  );
  const [proxyAddress, setProxyAddress] = React.useState(undefined);
  const signer = useContext(SignerContext);

  const deployModule = async (name) => {
    const codePath = `/code/${name}.json`;
    const code = fetchJson(codePath);
    const factory = new ethers.ContractFactory(code.abi, code.bytecode, signer);
    const contract = await factory.deploy();
    return contract.address;
  };

  const deployProxy = async (moduleAddresses) => {
    const codePath = `/code/proxy.json`;
    const code = fetchJson(codePath);
    const factory = new ethers.ContractFactory(code.abi, code.bytecode, signer);
    const contract = await factory.deploy([moduleAddresses]);
    setProxyAddress(contract.address);
  };

  const deployProfile = async () => {
    const chosenModules = modules.filter((m, i) => selectedModules[i]);
    if (chosenModules.length === 0) {
      console.log('No modules selected');
    } else {
      console.log(chosenModules);
    }
    return;
    const moduleName = chosenModules.map((module) => module.codeJsonName);
    const deployedModules = await Promise.all(moduleName.map(deployModule));
    await deployProxy(deployedModules);
  };

  if (proxyAddress) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-red-500 capitalize">Profile created!</h1>
        <p>Your profile is now available at {proxyAddress}</p>
      </div>
    );
  }

  return (
    <div>
      Create profile
      <ul>
        {modules.map((module, i) => (
          <li key={i} className="bg-white p-2 rounded-lg my-2 shadow-lg w-80">
            <button
              className="bg-green-300 p-1 rounded-sm w-60"
              onClick={() => deployModule(module.codeJsonName)}
            >
              {module.name}
            </button>
            <input
              type="checkbox"
              className="m-2 "
              checked={selectedModules[i]}
              onChange={() =>
                setSelectedModules(
                  selectedModules.map((s, j) => (i === j ? !s : s))
                )
              }
            />
          </li>
        ))}
      </ul>
      <button onClick={deployProfile}>Create profile</button>
    </div>
  );
}
