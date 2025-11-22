import { ethers } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with account:', deployer.address);
  console.log('Account balance:', (await ethers.provider.getBalance(deployer.address)).toString());

  // Step 1: Deploy MockIdentityVerificationHubV2 (for SelfHumanSBT)
  console.log('\n1. Deploying MockIdentityVerificationHubV2...');
  const MockHub = await ethers.getContractFactory('MockIdentityVerificationHubV2');
  const mockHub = await MockHub.deploy();
  await mockHub.waitForDeployment();
  const mockHubAddress = await mockHub.getAddress();
  console.log('   MockIdentityVerificationHubV2 deployed to:', mockHubAddress);

  // Step 2: Deploy MockAztecVerifier (for SkillLeaderboard)
  console.log('\n2. Deploying MockAztecVerifier...');
  const MockVerifier = await ethers.getContractFactory('MockAztecVerifier');
  const mockVerifier = await MockVerifier.deploy();
  await mockVerifier.waitForDeployment();
  const mockVerifierAddress = await mockVerifier.getAddress();
  console.log('   MockAztecVerifier deployed to:', mockVerifierAddress);

  // Step 3: Deploy SelfHumanSBT with mock Hub
  console.log('\n3. Deploying SelfHumanSBT...');
  const rawConfig = {
    olderThan: 18,
    forbiddenCountries: [],
    ofacEnabled: false,
  };
  const SelfHumanSBT = await ethers.getContractFactory('SelfHumanSBT');
  const selfHumanSBT = await SelfHumanSBT.deploy(
    mockHubAddress,
    'proof-of-human',
    rawConfig
  );
  await selfHumanSBT.waitForDeployment();
  const selfHumanSBTAddress = await selfHumanSBT.getAddress();
  console.log('   SelfHumanSBT deployed to:', selfHumanSBTAddress);

  // Step 4: Deploy SkillLeaderboard
  console.log('\n4. Deploying SkillLeaderboard...');
  const SkillLeaderboard = await ethers.getContractFactory('SkillLeaderboard');
  const skillLeaderboard = await SkillLeaderboard.deploy(
    selfHumanSBTAddress,
    mockVerifierAddress
  );
  await skillLeaderboard.waitForDeployment();
  const skillLeaderboardAddress = await skillLeaderboard.getAddress();
  console.log('   SkillLeaderboard deployed to:', skillLeaderboardAddress);

  const network = await ethers.provider.getNetwork();
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    addresses: {
      MockIdentityVerificationHubV2: mockHubAddress,
      MockAztecVerifier: mockVerifierAddress,
      SelfHumanSBT: selfHumanSBTAddress,
      SkillLeaderboard: skillLeaderboardAddress,
    },
  };

  console.log('\n✅ Deployment complete!');
  console.log('📋 Contract Addresses:');
  console.log(JSON.stringify(deploymentInfo.addresses, null, 2));
  console.log('\n💡 Update playground/main.ts with these addresses if they differ from defaults.');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
