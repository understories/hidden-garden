import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {},
    celoTestnet: {
      url: '',
      chainId: 44787,
      accounts: [],
    },
    celoMainnet: {
      url: '',
      chainId: 42220,
      accounts: [],
    },
  },
};

export default config;

