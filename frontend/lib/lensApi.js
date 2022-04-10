const MUMBAI_LENS_CONFIG = {
  hubAddress: '0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0',
};

const lensHub = new LensHub(MUMBAI_LENS_CONFIG.hubAddress, web3);

export const mintProfile = async (permissionsProxyAddress, signer) => {
  const inputStruct = {
    to: permissionsProxyAddress,
    handle: '',
    imageURI: '',
    followModule: ZERO_ADDRESS,
    followModuleData: [],
    followNFTURI: '',
  };

  await waitForTx(lensHub.connect(signer).createProfile(inputStruct));

  const profile = await lensHub.mintProfile(profileAddress, address);
  console.log('Profile:', profile);
};
