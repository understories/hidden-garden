// Hidden Garden Contract Playground
// Developer testing sandbox for SelfHumanSBT + SkillLeaderboard contracts

import { ethers } from 'https://cdn.jsdelivr.net/npm/ethers@6.15.0/dist/ethers.min.js';
import {
  SELF_HUMAN_SBT_ADDRESS,
  SKILL_LEADERBOARD_ADDRESS,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
} from '@hidden-garden/common/contracts';

// Configuration
const INDEXER_URL = 'http://localhost:4000';
const RPC_URL = 'http://localhost:8545';

// State
let provider: ethers.BrowserProvider | null = null;
let signer: ethers.JsonRpcSigner | null = null;
let selfHumanSBT: ethers.Contract | null = null;
let skillLeaderboard: ethers.Contract | null = null;

// DOM Elements
const connectBtn = document.getElementById('connectBtn') as HTMLButtonElement;
const walletStatus = document.getElementById('walletStatus') as HTMLDivElement;
const walletAddress = document.getElementById('walletAddress') as HTMLSpanElement;
const mintSbtBtn = document.getElementById('mintSbtBtn') as HTMLButtonElement;
const sbtStatus = document.getElementById('sbtStatus') as HTMLDivElement;
const skillIdInput = document.getElementById('skillId') as HTMLInputElement;
const tierInput = document.getElementById('tier') as HTMLInputElement;
const submitSkillBtn = document.getElementById('submitSkillBtn') as HTMLButtonElement;
const skillStatus = document.getElementById('skillStatus') as HTMLDivElement;
const skillHashInput = document.getElementById('skillHash') as HTMLInputElement;
const fetchLeaderboardBtn = document.getElementById('fetchLeaderboardBtn') as HTMLButtonElement;
const leaderboardStatus = document.getElementById('leaderboardStatus') as HTMLDivElement;
const leaderboardResult = document.getElementById('leaderboardResult') as HTMLPreElement;

// Initialize contracts when wallet is connected
function initializeContracts(address: string) {
  if (!provider || !signer) return;

  selfHumanSBT = new ethers.Contract(
    SELF_HUMAN_SBT_ADDRESS,
    SelfHumanSBTAbi,
    signer
  );

  skillLeaderboard = new ethers.Contract(
    SKILL_LEADERBOARD_ADDRESS,
    SkillLeaderboardAbi,
    signer
  );

  console.log('Contracts initialized:', {
    selfHumanSBT: SELF_HUMAN_SBT_ADDRESS,
    skillLeaderboard: SKILL_LEADERBOARD_ADDRESS,
  });
}

// Connect wallet handler
connectBtn.addEventListener('click', async () => {
  try {
    if (!window.ethereum) {
      showStatus(sbtStatus, 'MetaMask not found. Please install MetaMask.', 'error');
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
    submitSkillBtn.disabled = false;

    initializeContracts(address);
    showStatus(sbtStatus, 'Wallet connected successfully!', 'success');
  } catch (error: any) {
    showStatus(sbtStatus, `Connection error: ${error.message}`, 'error');
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
    showStatus(sbtStatus, `✅ SBT minted successfully! Block: ${receipt.blockNumber}`, 'success');
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

// Fetch leaderboard handler
fetchLeaderboardBtn.addEventListener('click', async () => {
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
});

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

console.log('Hidden Garden Playground loaded');
console.log('Contract addresses:', {
  SelfHumanSBT: SELF_HUMAN_SBT_ADDRESS,
  SkillLeaderboard: SKILL_LEADERBOARD_ADDRESS,
});

