import React, { useContext } from 'react';
import { fetchJson } from 'ethers/lib/utils';
import { ethers } from 'ethers';
import SignerProvider from '../contexts/SignerContext';
import Button from './Button';

export default function DeployProxy({ modules, onProxyCreated }) {
  const [selectedModules, setSelectedModules] = React.useState(
    modules.map((m) => false)
  );
  const signer = useContext(SignerProvider);

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
    onProxyCreated('0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0');
    return;
    const moduleName = chosenModules.map((module) => module.codeJsonName);
    const deployedModules = await Promise.all(moduleName.map(deployModule));
    await deployProxy(deployedModules);
  };

  return (
    <div>
      Create profile
      <ul>
        {modules.map((module, i) => (
          <li key={i} className="bg-white p-2 rounded-lg my-2 shadow-lg w-80">
            <Button
              className="bg-green-400 hover:bg-green-200"
              onClick={() => deployModule(module.codeJsonName)}
            >
              {module.name}
            </Button>
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
      <Button onClick={deployProfile}>Create profile</Button>
    </div>
  );
}
