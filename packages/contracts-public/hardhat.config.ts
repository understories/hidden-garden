import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.20',
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

