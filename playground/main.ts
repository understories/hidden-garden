// Hidden Garden Contract Playground
// Full-featured playground for testing all Hidden Garden features

import { ethers } from 'ethers';

// Contract addresses (local Hardhat network)
const SELF_HUMAN_SBT_ADDRESS = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';
const SKILL_LEADERBOARD_ADDRESS = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';

// Minimal ABIs for contract interaction
const SelfHumanSBTAbi = [
  'function verifyAndMint(bytes calldata proofPayload, bytes calldata userContextData) external',
  'function hasValidSBT(address user) external view returns (bool)',
  'function ownerOf(uint256 tokenId) external view returns (address)',
  'function balanceOf(address owner) external view returns (uint256)',
];

const SkillLeaderboardAbi = [
  'function submitSkillTier(bytes32 skillHash, uint8 tier) external',
  'function submitSkillTierWithProof(bytes32 skillHash, uint8 minLevel, bytes calldata proof, bytes calldata publicInputs) external',
  'function skillTier(bytes32 skillHash, address user) external view returns (uint8)',
];

// Helper function to hash skill names
function hashSkillName(name: string): `0x${string}` {
  const normalized = name.trim().toLowerCase();
  return ethers.keccak256(ethers.toUtf8Bytes(normalized)) as `0x${string}`;
}

// Leaderboard client
class LeaderboardClient {
  private baseUrl: string;
  constructor(config: { baseUrl: string }) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
  }
  async getLeaderboard(skillHash: string) {
    const url = `${this.baseUrl}/leaderboard?skillHash=${encodeURIComponent(skillHash)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
  async getUserSkills(address: string) {
    const url = `${this.baseUrl}/user/${encodeURIComponent(address)}/skills`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
  }
}

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
let leaderboardClient: any = null;
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
const zkSkillIdInput = document.getElementById('zkSkillId') as HTMLInputElement;
const zkMinLevelInput = document.getElementById('zkMinLevel') as HTMLInputElement;
const submitZkProofBtn = document.getElementById('submitZkProofBtn') as HTMLButtonElement;
const zkStatus = document.getElementById('zkStatus') as HTMLDivElement;
const skillHashInput = document.getElementById('skillHash') as HTMLInputElement;
const fetchLeaderboardBtn = document.getElementById('fetchLeaderboardBtn') as HTMLButtonElement;
const fetchUserSkillsBtn = document.getElementById('fetchUserSkillsBtn') as HTMLButtonElement;
const leaderboardStatus = document.getElementById('leaderboardStatus') as HTMLDivElement;
const leaderboardDisplay = document.getElementById('leaderboardDisplay') as HTMLDivElement;
const leaderboardTable = document.getElementById('leaderboardTable') as HTMLDivElement;
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
  
  if (selectedValue !== 'local') {
    networkSelect.value = 'local';
    showStatus(sbtStatus, '⚠️ MVP Testing: Please use Local (Hardhat) network only.', 'info');
    return;
  }
  
  currentNetwork = 'local';
  
  customAddresses.style.display = 'none';
  
  selfHumanSBT = null;
  skillLeaderboard = null;
  
  if (signer) {
    initializeContracts();
  }
  
  updateNetworkStatus();
});

// Custom address input handlers
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

    leaderboardClient = new LeaderboardClient({ baseUrl: INDEXER_URL });

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
    return true;
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
    submitZkProofBtn.disabled = false;
    fetchLeaderboardBtn.disabled = false;
    fetchUserSkillsBtn.disabled = false;

    initializeContracts();
    
    if (selfHumanSBT && skillLeaderboard) {
      showStatus(sbtStatus, 'Wallet connected and contracts initialized!', 'success');
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
    
    if (provider) {
      const addresses = getContractAddresses();
      const code = await provider.getCode(addresses.sbt);
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
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    if (errorMsg.includes('could not decode result data')) {
      showStatus(
        sbtStatus,
        '⚠️ Verification call failed (dev environment issue). If you just minted, the SBT is valid.',
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

    const tx = await selfHumanSBT.verifyAndMint('0x1234', '0x');
    showStatus(sbtStatus, `Transaction sent: ${tx.hash}. Waiting for confirmation...`, 'info');

    const receipt = await tx.wait();
    
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
      if (verifyError.message?.includes('could not decode result data')) {
        verificationMsg += `\nℹ️ Note: Verification call failed (dev environment quirk), but mint transaction succeeded.`;
      } else {
        verificationMsg += `\n⚠️ Could not verify on-chain: ${verifyError.message}`;
      }
    }
    
    showStatus(sbtStatus, verificationMsg, 'success');
    
    const addresses = getContractAddresses();
    console.log('📋 Transaction Details:', {
      hash: tx.hash,
      blockNumber: receipt.blockNumber,
      from: address,
      to: addresses.sbt,
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

// Submit skill tier handler (v1 - plain)
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

    const skillHash = hashSkillName(skillId);
    console.log(`Submitting: skillId="${skillId}" -> hash=${skillHash}, tier=${tier}`);

    const tx = await skillLeaderboard.submitSkillTier(skillHash, tier);
    showStatus(skillStatus, `Transaction sent: ${tx.hash}. Waiting for confirmation...`, 'info');

    const receipt = await tx.wait();
    showStatus(
      skillStatus,
      `✅ Skill tier submitted! Block: ${receipt.blockNumber}, Hash: ${skillHash}`,
      'success'
    );

    skillHashInput.value = skillHash;
    
    setTimeout(() => {
      if (leaderboardClient) {
        fetchLeaderboard(skillHash);
      }
    }, 2000);
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    showStatus(skillStatus, `❌ Error: ${errorMsg}`, 'error');
  } finally {
    submitSkillBtn.disabled = false;
  }
});

// Submit ZK proof handler (v2)
submitZkProofBtn.addEventListener('click', async () => {
  if (!skillLeaderboard || !signer) {
    showStatus(zkStatus, 'Please connect wallet first.', 'error');
    return;
  }

  const skillId = zkSkillIdInput.value.trim();
  const minLevel = parseInt(zkMinLevelInput.value, 10);

  if (!skillId) {
    showStatus(zkStatus, 'Please enter a skill ID.', 'error');
    return;
  }

  if (isNaN(minLevel) || minLevel < 1 || minLevel > 10) {
    showStatus(zkStatus, 'Min level must be between 1 and 10.', 'error');
    return;
  }

  try {
    submitZkProofBtn.disabled = true;
    showStatus(zkStatus, 'Submitting skill tier with ZK proof...', 'info');

    const skillHash = hashSkillName(skillId);
    const address = await signer.getAddress();
    
    const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'bytes32', 'uint8'],
      [address, skillHash, minLevel]
    );

    const proof = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

    const tx = await skillLeaderboard.submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);
    showStatus(zkStatus, `Transaction sent: ${tx.hash}. Waiting for confirmation...`, 'info');

    const receipt = await tx.wait();
    showStatus(
      zkStatus,
      `✅ Skill tier submitted with ZK proof! Block: ${receipt.blockNumber}, Hash: ${skillHash}, Level: ${minLevel}`,
      'success'
    );

    skillHashInput.value = skillHash;
    
    setTimeout(() => {
      if (leaderboardClient) {
        fetchLeaderboard(skillHash);
      }
    }, 2000);
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    showStatus(zkStatus, `❌ Error: ${errorMsg}`, 'error');
  } finally {
    submitZkProofBtn.disabled = false;
  }
});

// Fetch leaderboard handler
fetchLeaderboardBtn.addEventListener('click', async () => {
  const input = skillHashInput.value.trim();
  
  if (!input) {
    showStatus(leaderboardStatus, 'Please enter a skill hash or skill name.', 'error');
    return;
  }

  let skillHash: string;
  if (input.startsWith('0x') && input.length === 66) {
    skillHash = input;
  } else {
    skillHash = hashSkillName(input);
    skillHashInput.value = skillHash;
  }

  await fetchLeaderboard(skillHash);
});

// Fetch user skills handler
fetchUserSkillsBtn.addEventListener('click', async () => {
  if (!signer || !leaderboardClient) {
    showStatus(leaderboardStatus, 'Please connect wallet first.', 'error');
    return;
  }

  try {
    fetchUserSkillsBtn.disabled = true;
    showStatus(leaderboardStatus, 'Fetching your skills...', 'info');

    const address = await signer.getAddress();
    const skills = await leaderboardClient.getUserSkills(address);

    if (skills.length === 0) {
      showStatus(leaderboardStatus, 'No skills found for your address.', 'info');
      leaderboardDisplay.style.display = 'none';
      leaderboardResult.style.display = 'none';
    } else {
      showStatus(leaderboardStatus, `✅ Found ${skills.length} skill(s)`, 'success');
      displaySkills(skills, `Your Skills (${address.slice(0, 10)}...)`);
    }
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    showStatus(leaderboardStatus, `❌ Error: ${errorMsg}`, 'error');
    leaderboardDisplay.style.display = 'none';
  } finally {
    fetchUserSkillsBtn.disabled = false;
  }
});

// Fetch leaderboard helper
async function fetchLeaderboard(skillHash: string) {
  if (!leaderboardClient) {
    showStatus(leaderboardStatus, 'Leaderboard client not initialized.', 'error');
    return;
  }

  try {
    fetchLeaderboardBtn.disabled = true;
    showStatus(leaderboardStatus, 'Fetching leaderboard...', 'info');

    const entries = await leaderboardClient.getLeaderboard(skillHash);
    
    if (entries.length === 0) {
      showStatus(leaderboardStatus, 'No entries found for this skill hash.', 'info');
      leaderboardDisplay.style.display = 'none';
      leaderboardResult.style.display = 'none';
    } else {
      showStatus(leaderboardStatus, `✅ Found ${entries.length} entry/entries`, 'success');
      displayLeaderboard(entries);
    }
  } catch (error: any) {
    const errorMsg = error.message || 'Unknown error';
    showStatus(leaderboardStatus, `❌ Error: ${errorMsg}`, 'error');
    leaderboardDisplay.style.display = 'none';
  } finally {
    fetchLeaderboardBtn.disabled = false;
  }
}

// Display leaderboard in a nice table
function displayLeaderboard(entries: any[]) {
  leaderboardDisplay.style.display = 'block';
  leaderboardResult.style.display = 'none';
  
  const sorted = [...entries].sort((a, b) => {
    if (b.tier !== a.tier) return b.tier - a.tier;
    return b.timestamp - a.timestamp;
  });

  let html = `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
      <thead>
        <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
          <th style="padding: 0.5rem; text-align: left;">Rank</th>
          <th style="padding: 0.5rem; text-align: left;">User</th>
          <th style="padding: 0.5rem; text-align: center;">Tier</th>
          <th style="padding: 0.5rem; text-align: left;">Updated</th>
        </tr>
      </thead>
      <tbody>
  `;

  sorted.forEach((entry, index) => {
    const rank = index + 1;
    const userDisplay = entry.ensName || entry.user_address.slice(0, 10) + '...';
    const date = new Date(entry.timestamp * 1000).toLocaleString();
    const tierEmoji = '⭐'.repeat(entry.tier);
    
    html += `
      <tr style="border-bottom: 1px solid #dee2e6;">
        <td style="padding: 0.5rem; font-weight: bold;">#${rank}</td>
        <td style="padding: 0.5rem; font-family: monospace; font-size: 0.85rem;">
          ${userDisplay}
          ${entry.ensName ? `<br><small style="color: #666;">${entry.user_address}</small>` : ''}
        </td>
        <td style="padding: 0.5rem; text-align: center; font-weight: bold; font-size: 1.1rem;">
          ${entry.tier} ${tierEmoji}
        </td>
        <td style="padding: 0.5rem; font-size: 0.85rem; color: #666;">${date}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  leaderboardTable.innerHTML = html;
}

// Display user skills
function displaySkills(skills: any[], title: string) {
  leaderboardDisplay.style.display = 'block';
  leaderboardResult.style.display = 'none';
  
  const sorted = [...skills].sort((a, b) => b.tier - a.tier);

  let html = `<h4 style="margin-bottom: 0.5rem;">${title}</h4>`;
  html += `
    <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
      <thead>
        <tr style="background: #f8f9fa; border-bottom: 2px solid #dee2e6;">
          <th style="padding: 0.5rem; text-align: left;">Skill Hash</th>
          <th style="padding: 0.5rem; text-align: center;">Tier</th>
          <th style="padding: 0.5rem; text-align: left;">Updated</th>
        </tr>
      </thead>
      <tbody>
  `;

  sorted.forEach((skill) => {
    const date = new Date(skill.timestamp * 1000).toLocaleString();
    const tierEmoji = '⭐'.repeat(skill.tier);
    
    html += `
      <tr style="border-bottom: 1px solid #dee2e6;">
        <td style="padding: 0.5rem; font-family: monospace; font-size: 0.85rem;">${skill.skill_hash}</td>
        <td style="padding: 0.5rem; text-align: center; font-weight: bold; font-size: 1.1rem;">
          ${skill.tier} ${tierEmoji}
        </td>
        <td style="padding: 0.5rem; font-size: 0.85rem; color: #666;">${date}</td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
  `;

  leaderboardTable.innerHTML = html;
}

// Helper function to show status messages
function showStatus(element: HTMLDivElement, message: string, type: 'success' | 'error' | 'info') {
  element.textContent = message;
  element.className = `status ${type}`;
  element.style.display = 'block';
}

// Helper: Auto-hash skill ID when typing
skillIdInput.addEventListener('input', async () => {
  const skillId = skillIdInput.value.trim();
  if (skillId) {
    try {
      const hash = hashSkillName(skillId);
      console.log(`Skill "${skillId}" hashes to: ${hash}`);
    } catch (e) {
      // Ignore
    }
  }
});

zkSkillIdInput.addEventListener('input', async () => {
  const skillId = zkSkillIdInput.value.trim();
  if (skillId) {
    try {
      const hash = hashSkillName(skillId);
      console.log(`ZK Skill "${skillId}" hashes to: ${hash}`);
    } catch (e) {
      // Ignore
    }
  }
});

// Initialize on page load
updateNetworkStatus();

console.log('Hidden Garden Playground loaded');
console.log('Default contract addresses (local):', {
  SelfHumanSBT: SELF_HUMAN_SBT_ADDRESS,
  SkillLeaderboard: SKILL_LEADERBOARD_ADDRESS,
});
