import { ethers } from 'ethers';

const config = {
  //mumbai
  hubAddress: '0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0',
  mockProxy: '0x39c9Bc23B1F993B94dEC69B7Ac11C95145EC4e15',
};
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
async function waitForTx(tx) {
  await (await tx).wait();
}

const abi = [
  {
    inputs: [{ internalType: 'address', name: 'hub', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'to', type: 'address' },
          { internalType: 'string', name: 'handle', type: 'string' },
          { internalType: 'string', name: 'imageURI', type: 'string' },
          { internalType: 'address', name: 'followModule', type: 'address' },
          { internalType: 'bytes', name: 'followModuleData', type: 'bytes' },
          { internalType: 'string', name: 'followNFTURI', type: 'string' },
        ],
        internalType: 'struct DataTypes.CreateProfileData',
        name: 'vars',
        type: 'tuple',
      },
    ],
    name: 'proxyCreateProfile',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export const mintProfile = async (ownerAddress, username, signer) => {
  const lensHub = new ethers.Contract(config.mockProxy, abi, signer);
  const profileData = {
    to: ownerAddress,
    handle: username,
    imageURI: '',
    followModule: ZERO_ADDRESS,
    followModuleData: [],
    followNFTURI: '',
  };

  await waitForTx(lensHub.proxyCreateProfile(profileData));
  console.log('Your profile has been created');
};
