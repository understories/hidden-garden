import { ethers } from 'ethers';
import {
  SELF_HUMAN_SBT_ADDRESS,
  SKILL_LEADERBOARD_ADDRESS,
  SelfHumanSBTAbi,
  SkillLeaderboardAbi,
} from '../packages/common/src/contracts';

const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const INDEXER_URL = process.env.INDEXER_URL || 'http://localhost:4000';

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function httpGet(url: string): Promise<any> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

async function main() {
  console.log('🌱 Starting Hidden Garden E2E Skill Test\n');

  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(
    '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80',
    provider
  );

  console.log(`📡 Connected to: ${RPC_URL}`);
  console.log(`👤 Using signer: ${signer.address}\n`);

  const selfHumanSBT = new ethers.Contract(
    SELF_HUMAN_SBT_ADDRESS,
    SelfHumanSBTAbi,
    signer
  );

  const skillLeaderboard = new ethers.Contract(
    SKILL_LEADERBOARD_ADDRESS,
    SkillLeaderboardAbi,
    signer
  );

  console.log('Step 1: Verifying and minting SBT...');
  try {
    const tx1 = await selfHumanSBT.verifyAndMint('0x1234');
    console.log(`  Transaction: ${tx1.hash}`);
    await tx1.wait();
    console.log('  ✅ SBT minted successfully\n');
  } catch (error: any) {
    if (error.message?.includes('SBT already exists')) {
      console.log('  ℹ️  SBT already exists for this address\n');
    } else {
      throw error;
    }
  }

  const skill1 = 'solidity';
  const skill2 = 'rust';
  const skillHash1 = ethers.keccak256(ethers.toUtf8Bytes(skill1));
  const skillHash2 = ethers.keccak256(ethers.toUtf8Bytes(skill2));
  const tier1 = 5;
  const tier2 = 7;

  console.log('Step 2: Submitting skill tiers...');
  console.log(`  Skill: ${skill1} (hash: ${skillHash1}) -> Tier ${tier1}`);
  const tx2 = await skillLeaderboard.submitSkillTier(skillHash1, tier1);
  console.log(`  Transaction: ${tx2.hash}`);
  await tx2.wait();
  console.log('  ✅ Skill tier submitted\n');

  console.log(`  Skill: ${skill2} (hash: ${skillHash2}) -> Tier ${tier2}`);
  const tx3 = await skillLeaderboard.submitSkillTier(skillHash2, tier2);
  console.log(`  Transaction: ${tx3.hash}`);
  await tx3.wait();
  console.log('  ✅ Skill tier submitted\n');

  console.log('Step 3: Waiting for indexer to process events (5 seconds)...');
  await sleep(5000);

  console.log('Step 4: Querying indexer endpoints...\n');

  try {
    console.log(`📊 Leaderboard for skill "${skill1}":`);
    const leaderboard1 = await httpGet(
      `${INDEXER_URL}/leaderboard?skillHash=${skillHash1}`
    );
    console.log(JSON.stringify(leaderboard1, null, 2));
    console.log('');

    console.log(`📊 Leaderboard for skill "${skill2}":`);
    const leaderboard2 = await httpGet(
      `${INDEXER_URL}/leaderboard?skillHash=${skillHash2}`
    );
    console.log(JSON.stringify(leaderboard2, null, 2));
    console.log('');

    console.log(`👤 Skills for user ${signer.address}:`);
    const userSkills = await httpGet(
      `${INDEXER_URL}/user/${signer.address}/skills`
    );
    console.log(JSON.stringify(userSkills, null, 2));
    console.log('');

    const foundSkill1 = userSkills.find(
      (s: any) => s.skill_hash.toLowerCase() === skillHash1.toLowerCase()
    );
    const foundSkill2 = userSkills.find(
      (s: any) => s.skill_hash.toLowerCase() === skillHash2.toLowerCase()
    );

    if (foundSkill1 && foundSkill1.tier === tier1) {
      console.log(`✅ Verified: ${skill1} tier ${tier1} indexed correctly`);
    } else {
      console.log(`❌ Error: ${skill1} tier not found or incorrect`);
    }

    if (foundSkill2 && foundSkill2.tier === tier2) {
      console.log(`✅ Verified: ${skill2} tier ${tier2} indexed correctly`);
    } else {
      console.log(`❌ Error: ${skill2} tier not found or incorrect`);
    }
  } catch (error: any) {
    console.error('❌ Error querying indexer:', error.message);
    throw error;
  }

  console.log('\n🎉 E2E test completed successfully!');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ E2E test failed:', error);
    process.exit(1);
  });

