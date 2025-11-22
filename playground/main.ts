// Hidden Garden Contract Playground
// Developer testing sandbox for SelfHumanSBT + SkillLeaderboard contracts

import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.15.0/dist/ethers.min.js';
import {
  SELF_HUMAN_SBT_ADDRESS,
  SKILL_LEADERBOARD_ADDRESS,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
} from '@hidden-garden/common/contracts';

// Network configurations
const NETWORKS = {
  local: {
    name: 'Local (Hardhat)',
    chainId: 31337,
    rpcUrl: 'http://localhost:8545',
    sbtAddress: SELF_HUMAN_SBT_ADDRESS,
    leaderboardAddress: SKILL_LEADERBOARD_ADDRESS,
  },
  sepolia: {
    name: 'Ethereum Sepolia',
    chainId: 11155111,
    rpcUrl: 'https://rpc.sepolia.org',
    // These will be set via custom addresses or need to be deployed
    sbtAddress: '',
    leaderboardAddress: '',
  },
  custom: {
    name: 'Custom',
    chainId: 0,
    rpcUrl: '',
    sbtAddress: '',
    leaderboardAddress: '',
  },
};

// Configuration
const INDEXER_URL = 'http://localhost:4000';

// State
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;
let selfHumanSBT: ethers.Contract | null = null;
let skillLeaderboard: ethers.Contract | null = null;
let currentNetwork: keyof typeof NETWORKS = 'local';

// DOM Elements
const networkSelect = document.getElementById('networkSelect') as HTMLSelectElement;
const customAddresses = document.getElementById('customAddresses') as HTMLDivElement;
const customSbtAddress = document.getElementById('customSbtAddress') as HTMLInputElement;
const customLeaderboardAddress = document.getElementById('customLeaderboardAddress') as HTMLInputElement;
const networkStatus = document.getElementById('networkStatus') as HTMLDivElement;
const networkInfo = document.getElementById('networkInfo') as HTMLSpanElement;
const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const walletStatus = document.getElementById('walletStatus') as HTMLDivElement;
const walletAddress = document.getElementById('walletAddress') as HTMLSpanElement;
const mintSbtBtn = document.getElementById('mintSbtBtn') as HTMLButtonElement;
const verifySbtBtn = document.getElementById('verifySbtBtn') as HTMLButtonElement;
const sbtStatus = document.getElementById('sbtStatus') as HTMLDivElement;
const skillIdInput = document.getElementById('skillId') as HTMLInputElement;
const tierInput = document.getElementById('tier') as HTMLInputElement;
const submitSkillBtn = document.getElementById('submitSkillBtn') as HTMLButtonElement;
const skillStatus = document.getElementById('skillStatus') as HTMLDivElement;
const skillHashInput = document.getElementById('skillHash') as HTMLInputElement;
const fetchLeaderboardBtn = document.getElementById('fetchLeaderboardBtn') as HTMLButtonElement;
const leaderboardStatus = document.getElementById('leaderboardStatus') as HTMLDivElement;
const leaderboardResult = document.getElementById('leaderboardResult') as HTMLPreElement;

// Get current contract addresses based on network
function getContractAddresses(): { sbt: string; leaderboard: string } {
  const network = NETWORKS[currentNetwork];
  
  if (currentNetwork === 'custom') {
    return {
      sbt: customSbtAddress.value.trim() || network.sbtAddress,
      leaderboard: customLeaderboardAddress.value.trim() || network.leaderboardAddress,
    };
  }
  
  return {
    sbt: network.sbtAddress,
    leaderboard: network.leaderboardAddress,
  };
}

// Update network status display
function updateNetworkStatus() {
  const network = NETWORKS[currentNetwork];
  const addresses = getContractAddresses();
  
  if (currentNetwork === 'sepolia' && !addresses.sbt) {
    networkInfo.textContent = `${network.name} - Please enter contract addresses below`;
    networkStatus.className = 'status error';
  } else if (currentNetwork === 'custom' && (!addresses.sbt || !addresses.leaderboard)) {
    networkInfo.textContent = `${network.name} - Please enter contract addresses`;
    networkStatus.className = 'status error';
  } else {
    networkInfo.textContent = `${network.name} | SBT: ${addresses.sbt.slice(0, 10)}... | Leaderboard: ${addresses.leaderboard.slice(0, 10)}...`;
    networkStatus.className = 'status success';
  }
  networkStatus.style.display = 'block';
}

// Network selector handler
networkSelect.addEventListener('change', () => {
  const selectedValue = networkSelect.value as keyof typeof NETWORKS;
  
  // Prevent switching away from local for MVP
  if (selectedValue !== 'local') {
    networkSelect.value = 'local';
    showStatus(sbtStatus, '⚠️ MVP Testing: Please use Local (Hardhat) network only.', 'info');
    return;
  }
  
  currentNetwork = 'local';
  
  customAddresses.style.display = 'none';
  
  // Reset contracts when network changes
  selfHumanSBT = null;
  skillLeaderboard = null;
  
  // Re-initialize if wallet is connected
  if (signer) {
    initializeContracts();
  }
  
  updateNetworkStatus();
});

// Custom address input handlers - re-initialize contracts when addresses change
customSbtAddress.addEventListener('input', () => {
  updateNetworkStatus();
  if (signer) {
    initializeContracts();
  }
});
customLeaderboardAddress.addEventListener('input', () => {
  updateNetworkStatus();
  if (signer) {
    initializeContracts();
  }
});

// Initialize contracts when wallet is connected
function initializeContracts() {
  if (!provider || !signer) {
    selfHumanSBT = null;
    skillLeaderboard = null;
    return;
  }

  const addresses = getContractAddresses();
  
  if (!addresses.sbt || !addresses.leaderboard) {
    selfHumanSBT = null;
    skillLeaderboard = null;
    if (currentNetwork === 'sepolia' || currentNetwork === 'custom') {
      showStatus(sbtStatus, 'Please enter contract addresses in the Network Configuration section above.', 'error');
    } else {
      showStatus(sbtStatus, 'Please configure contract addresses for the selected network.', 'error');
    }
    return;
  }

  // Validate address format
  if (!ethers.isAddress(addresses.sbt) || !ethers.isAddress(addresses.leaderboard)) {
    selfHumanSBT = null;
    skillLeaderboard = null;
    showStatus(sbtStatus, 'Invalid contract address format. Please check your addresses.', 'error');
    return;
  }

  try {
    selfHumanSBT = new ethers.Contract(
      addresses.sbt,
      SelfHumanSBTAbi,
      signer
    );

    skillLeaderboard = new ethers.Contract(
      addresses.leaderboard,
      SkillLeaderboardAbi,
      signer
    );

    console.log('Contracts initialized:', {
      network: currentNetwork,
      selfHumanSBT: addresses.sbt,
      skillLeaderboard: addresses.leaderboard,
    });
    
    showStatus(sbtStatus, '✅ Contracts initialized successfully!', 'success');
  } catch (error: any) {
    selfHumanSBT = null;
    skillLeaderboard = null;
    showStatus(sbtStatus, `Error initializing contracts: ${error.message}`, 'error');
  }
}

// Switch MetaMask network if needed
async function switchNetworkIfNeeded(): Promise<boolean> {
  if (!window.ethereum || currentNetwork === 'local' || currentNetwork === 'custom') {
    return true; // Skip for local/custom
  }

  const network = NETWORKS[currentNetwork];
  
  try {
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId, 16);
    
    if (currentChainId !== network.chainId) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${network.chainId.toString(16)}` }],
        });
        return true;
      } catch (switchError: any) {
        // Chain doesn't exist, try to add it
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${network.chainId.toString(16)}`,
                chainName: network.name,
                rpcUrls: [network.rpcUrl],
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
              },
            ],
          });
          return true;
        }
        throw switchError;
      }
    }
    return true;
  } catch (error: any) {
    showStatus(sbtStatus, `Network switch error: ${error.message}`, 'error');
    return false;
  }
}

// Connect wallet handler
connectBtn.addEventListener('click', async () => {
  try {
    if (!window.ethereum) {
      showStatus(sbtStatus, 'MetaMask not found. Please install MetaMask.', 'error');
      return;
    }

    // Switch network if needed
    const networkSwitched = await switchNetworkIfNeeded();
    if (!networkSwitched) {
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length === 0) {
      showStatus(sbtStatus, 'No accounts found. Please unlock MetaMask.', 'error');
      return;
    }

    signer = await provider.getSigner();
    const address = await signer.getAddress();

    walletAddress.textContent = address;
    walletStatus.style.display = 'block';
    connectBtn.disabled = true;
    mintSbtBtn.disabled = false;
    verifySbtBtn.disabled = false;
    submitSkillBtn.disabled = false;

    // Initialize contracts after connection
    initializeContracts();
    
    // Only show success if contracts were initialized
    if (selfHumanSBT && skillLeaderboard) {
      showStatus(sbtStatus, 'Wallet connected and contracts initialized!', 'success');
    } else {
      // Error message already shown by initializeContracts
    }
  } catch (error: any) {
    showStatus(sbtStatus, `Connection error: ${error.message}`, 'error');
  }
});

// Verify SBT handler
verifySbtBtn.addEventListener('click', async () => {
  if (!selfHumanSBT || !signer) {
    showStatus(sbtStatus, 'Please connect wallet first.', 'error');
    return;
  }

  try {
    verifySbtBtn.disabled = true;
    showStatus(sbtStatus, 'Verifying SBT on-chain...', 'info');

    const address = await signer.getAddress();
    
    // First check if contract has code
    if (provider) {
      const code = await provider.getCode(SELF_HUMAN_SBT_ADDRESS);
      if (!code || code === '0x') {
        showStatus(
          sbtStatus,
          '❌ Contract not deployed! Please:\n1. Start Hardhat node: pnpm --filter @hidden-garden/contracts-public node\n2. Deploy: pnpm --filter @hidden-garden/contracts-public deploy:node',
          'error'
        );
        return;
      }
    }

    const hasSBT = await selfHumanSBT.hasValidSBT(address);
    const tokenId = BigInt(address);

    let verificationMsg = `\n📋 On-Chain Verification:\n`;
    verificationMsg += `   Address: ${address}\n`;
    verificationMsg += `   hasValidSBT: ${hasSBT ? '✅ YES' : '❌ NO'}\n`;
    verificationMsg += `   Token ID: ${tokenId.toString()}\n`;

    if (hasSBT) {
      try {
        const owner = await selfHumanSBT.ownerOf(tokenId);
        verificationMsg += `   Owner: ${owner}\n`;
        verificationMsg += `   ✅ Owner matches: ${owner.toLowerCase() === address.toLowerCase()}\n`;
      } catch (e: any) {
        verificationMsg += `   ⚠️ Could not fetch owner: ${e.message}\n`;
      }

      try {
        const balance = await selfHumanSBT.balanceOf(address);
        verificationMsg += `   Balance: ${balance.toString()}\n`;
      } catch (e: any) {
        verificationMsg += `   ⚠️ Could not fetch balance\n`;
      }

      showStatus(sbtStatus, `✅ SBT Verified On-Chain!${verificationMsg}`, 'success');
    } else {
      showStatus(sbtStatus, `❌ No SBT found for this address.${verificationMsg}`, 'error');
    }

    console.log('SBT Verification:', {
      address,
      hasSBT,
      tokenId: tokenId.toString(),
    });
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    // Known dev issue: if it's a decode error, the contract might still be valid
    if (errorMsg.includes('could not decode result data')) {
      showStatus(
        sbtStatus,
        '⚠️ Verification call failed (dev environment issue). If you just minted, the SBT is valid - check the transaction hash.',
        'info'
      );
    } else {
      showStatus(sbtStatus, `❌ Verification error: ${errorMsg}`, 'error');
    }
  } finally {
    verifySbtBtn.disabled = false;
  }
});

// Mint SBT handler
mintSbtBtn.addEventListener('click', async () => {
  if (!selfHumanSBT || !signer) {
    showStatus(sbtStatus, 'Please connect wallet first.', 'error');
    return;
  }

  try {
    mintSbtBtn.disabled = true;
    showStatus(sbtStatus, 'Minting SBT...', 'info');

    const tx = await selfHumanSBT.verifyAndMint('0x1234');
    showStatus(sbtStatus, `Transaction sent: ${tx.hash}. Waiting for confirmation...`, 'info');

    const receipt = await tx.wait();
    
    // Verify on-chain after minting
    const address = await signer.getAddress();
    let verificationMsg = `✅ SBT minted successfully! Block: ${receipt.blockNumber}`;
    let hasSBT = false;
    let tokenId = BigInt(0);
    
    try {
      hasSBT = await selfHumanSBT.hasValidSBT(address);
      tokenId = BigInt(address);
      
      if (hasSBT) {
        verificationMsg += `\n✅ Verified on-chain: hasValidSBT = true, Token ID: ${tokenId.toString()}`;
      } else {
        verificationMsg += `\n⚠️ Warning: On-chain verification returned false`;
      }
    } catch (verifyError: any) {
      // Known dev issue: verification may fail due to timing/caching, but minting works
      if (verifyError.message?.includes('could not decode result data')) {
        verificationMsg += `\nℹ️ Note: Verification call failed (dev environment quirk), but mint transaction succeeded.`;
      } else {
        verificationMsg += `\n⚠️ Could not verify on-chain: ${verifyError.message}`;
      }
    }
    
    showStatus(sbtStatus, verificationMsg, 'success');
    
    // Log to console for debugging
    console.log('📋 Transaction Details:', {
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      from: address,
      to: SELF_HUMAN_SBT_ADDRESS,
      hasSBT,
      tokenId: tokenId.toString(),
    });
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    if (errorMsg.includes('SBT already exists')) {
      showStatus(sbtStatus, 'ℹ️ SBT already exists for this address.', 'info');
    } else {
      showStatus(sbtStatus, `❌ Error: ${errorMsg}`, 'error');
    }
  } finally {
    mintSbtBtn.disabled = false;
  }
});

// Submit skill tier handler
submitSkillBtn.addEventListener('click', async () => {
  if (!skillLeaderboard || !signer) {
    showStatus(skillStatus, 'Please connect wallet first.', 'error');
    return;
  }

  const skillId = skillIdInput.value.trim();
  const tier = parseInt(tierInput.value, 10);

  if (!skillId) {
    showStatus(skillStatus, 'Please enter a skill ID.', 'error');
    return;
  }

  if (isNaN(tier) || tier < 1 || tier > 10) {
    showStatus(skillStatus, 'Tier must be between 1 and 10.', 'error');
    return;
  }

  try {
    submitSkillBtn.disabled = true;
    showStatus(skillStatus, 'Submitting skill tier...', 'info');

    // Hash the skill ID
    const skillHash = ethers.keccak256(ethers.toUtf8Bytes(skillId));
    console.log(`Submitting: skillId="${skillId}" -> hash=${skillHash}, tier=${tier}`);

    const tx = await skillLeaderboard.submitSkillTier(skillHash, tier);
    showStatus(skillStatus, `Transaction sent: ${tx.hash}. Waiting for confirmation...`, 'info');

    const receipt = await tx.wait();
    showStatus(
      skillStatus,
      `✅ Skill tier submitted! Block: ${receipt.blockNumber}, Hash: ${skillHash}`,
      'success'
    );

    // Update the leaderboard input with the hash for easy testing
    skillHashInput.value = skillHash;
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    showStatus(skillStatus, `❌ Error: ${errorMsg}`, 'error');
  } finally {
    submitSkillBtn.disabled = false;
  }
});

// Fetch leaderboard handler (disabled for MVP)
// fetchLeaderboardBtn.addEventListener('click', async () => {
const _fetchLeaderboardHandler = async () => {
  const skillHash = skillHashInput.value.trim();

  if (!skillHash) {
    showStatus(leaderboardStatus, 'Please enter a skill hash.', 'error');
    return;
  }

  if (!skillHash.startsWith('0x') || skillHash.length !== 66) {
    showStatus(leaderboardStatus, 'Invalid skill hash format. Expected 0x followed by 64 hex characters.', 'error');
    return;
  }

  try {
    fetchLeaderboardBtn.disabled = true;
    showStatus(leaderboardStatus, 'Fetching leaderboard...', 'info');

    const url = `${INDEXER_URL}/leaderboard?skillHash=${encodeURIComponent(skillHash)}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (Array.isArray(data) && data.length === 0) {
      showStatus(leaderboardStatus, 'No entries found for this skill hash.', 'info');
      leaderboardResult.style.display = 'none';
    } else {
      showStatus(leaderboardStatus, `✅ Found ${data.length} entry/entries`, 'success');
      leaderboardResult.textContent = JSON.stringify(data, null, 2);
      leaderboardResult.style.display = 'block';
    }
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    showStatus(leaderboardStatus, `❌ Error: ${errorMsg}`, 'error');
    leaderboardResult.style.display = 'none';
  } finally {
    fetchLeaderboardBtn.disabled = false;
  }
};
// Disabled for MVP - uncomment when ready
// fetchLeaderboardBtn.addEventListener('click', _fetchLeaderboardHandler);

// Helper function to show status messages
function showStatus(element: HTMLDivElement, message: string, type: 'success' | 'error' | 'info') {
  element.textContent = message;
  element.className = `status ${type}`;
  element.style.display = 'block';
}

// Helper: Auto-hash skill ID when typing (for convenience)
skillIdInput.addEventListener('input', () => {
  const skillId = skillIdInput.value.trim();
  if (skillId) {
    try {
      const hash = ethers.keccak256(ethers.toUtf8Bytes(skillId));
      // Don't auto-fill, but show a hint in console
      console.log(`Skill "${skillId}" hashes to: ${hash}`);
    } catch (e) {
      // Ignore
    }
  }
});

// Initialize network status on load
updateNetworkStatus();

console.log('Hidden Garden Playground loaded');
console.log('Default contract addresses (local):', {
  SelfHumanSBT: SELF_HUMAN_SBT_ADDRESS,
  SkillLeaderboard: SKILL_LEADERBOARD_ADDRESS,
});
