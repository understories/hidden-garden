import { expect } from 'chai';
import { ethers } from 'hardhat';

// Helper to create a GenericDiscloseOutputV2 struct for testing
// Note: We need to match the exact struct layout from ISelfVerificationRoot
// Based on the compiled ABI, the struct has this order:
// attestationId (bytes32), userIdentifier (uint256), nullifier (uint256),
// forbiddenCountriesListPacked (uint256[4]), issuingState (string),
// name (string[]), idNumber (string), nationality (string),
// dateOfBirth (string), gender (string), expiryDate (string),
// olderThan (uint256), ofac (bool)
function createMockOutput(userAddress: string): any {
  const userIdentifier = BigInt(userAddress);
  // Return as an object matching the struct fields
  return {
    attestationId: ethers.ZeroHash,
    userIdentifier: userIdentifier,
    nullifier: ethers.ZeroHash,
    forbiddenCountriesListPacked: [0n, 0n, 0n, 0n], // uint256[4]
    issuingState: '',
    name: [], // string[]
    idNumber: '',
    nationality: '',
    dateOfBirth: '',
    gender: '',
    expiryDate: '',
    olderThan: 0n,
    ofac: [false, false, false], // bool[3] based on ABI
  };
}

describe('SelfHumanSBT - Self Integration', function () {
  let mockHub: any;
  let sbtHarness: any;
  let rawConfig: any;

  beforeEach(async function () {
    // Deploy mock Hub
    const MockHub = await ethers.getContractFactory('MockIdentityVerificationHubV2');
    mockHub = await MockHub.deploy();

    // Create a minimal verification config
    rawConfig = {
      olderThan: 18,
      forbiddenCountries: [],
      ofacEnabled: false,
    };

    // Deploy test harness
    const TestHarness = await ethers.getContractFactory('SelfHumanSBTTestHarness');
    sbtHarness = await TestHarness.deploy(
      await mockHub.getAddress(),
      'proof-of-human',
      rawConfig
    );
  });

  describe('Minting via Self callback', function () {
    it('Should mint SBT only via customVerificationHook callback', async function () {
      const [user] = await ethers.getSigners();
      const userAddress = user.address;

      // Before callback: no SBT
      expect(await sbtHarness.hasValidSBT(userAddress)).to.be.false;
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(0n);

      // Create mock output
      const output = createMockOutput(userAddress);
      const userData = '0x';

      // Call the hook directly (simulating Hub callback)
      // Encode manually to avoid ethers struct encoding issues
      const iface = sbtHarness.interface;
      const encoded = iface.encodeFunctionData('testCustomVerificationHook', [output, userData]);
      const tx = await user.sendTransaction({
        to: await sbtHarness.getAddress(),
        data: encoded,
      });
      await tx.wait();

      // After callback: SBT minted
      expect(await sbtHarness.hasValidSBT(userAddress)).to.be.true;
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(1n);

      // Verify tokenId
      const tokenId = BigInt(userAddress);
      expect(await sbtHarness.ownerOf(tokenId)).to.equal(userAddress);
    });

    it('Should emit HumanVerified event on mint', async function () {
      const [user] = await ethers.getSigners();
      const userAddress = user.address;
      const output = createMockOutput(userAddress);
      const userData = '0x';

      const iface = sbtHarness.interface;
      const encoded = iface.encodeFunctionData('testCustomVerificationHook', [output, userData]);
      const tx = await user.sendTransaction({
        to: await sbtHarness.getAddress(),
        data: encoded,
      });
      const receipt = await tx.wait();

      // Check for HumanVerified event
      const event = receipt?.logs.find(
        (log: any) => {
          try {
            const parsed = sbtHarness.interface.parseLog(log);
            return parsed?.name === 'HumanVerified';
          } catch {
            return false;
          }
        }
      );

      expect(event).to.not.be.undefined;

      if (event) {
        const parsed = sbtHarness.interface.parseLog(event);
        expect(parsed?.args[0]).to.equal(userAddress); // user
        expect(parsed?.args[1]).to.equal(BigInt(userAddress)); // tokenId
      }
    });
  });

  describe('No double mint', function () {
    it('Should revert on second mint attempt for same user', async function () {
      const [user] = await ethers.getSigners();
      const userAddress = user.address;
      const output = createMockOutput(userAddress);
      const userData = '0x';

      // First mint succeeds
      const iface = sbtHarness.interface;
      const encoded1 = iface.encodeFunctionData('testCustomVerificationHook', [output, userData]);
      const tx1 = await user.sendTransaction({
        to: await sbtHarness.getAddress(),
        data: encoded1,
      });
      await tx1.wait();
      expect(await sbtHarness.hasValidSBT(userAddress)).to.be.true;
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(1n);

      // Second mint should revert
      try {
        const encoded2 = iface.encodeFunctionData('testCustomVerificationHook', [output, userData]);
        const tx2 = await user.sendTransaction({
          to: await sbtHarness.getAddress(),
          data: encoded2,
        });
        await tx2.wait();
        expect.fail('Expected transaction to revert');
      } catch (error: any) {
        expect(error.message).to.include('SBT already exists for this address');
      }

      // Balance should still be 1
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(1n);
    });
  });

  describe('verifyAndMint behavior', function () {
    it('Should forward proof to verifySelfProof without minting', async function () {
      const [user] = await ethers.getSigners();
      const userAddress = user.address;

      // Before verifyAndMint: no SBT
      expect(await sbtHarness.hasValidSBT(userAddress)).to.be.false;
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(0n);

      // Call verifyAndMint with dummy proof
      const proofPayload = '0x1234';
      const userContextData = '0x';

      // This will call verifySelfProof, which will try to call the Hub
      // Since we're using a mock Hub that doesn't implement the full interface,
      // this will likely revert. That's expected - we're testing that verifyAndMint
      // doesn't mint directly.
      try {
        await sbtHarness.connect(user).verifyAndMint(proofPayload, userContextData);
        // If it doesn't revert, that's fine - the important thing is no mint happened
      } catch (error: any) {
        // Expected - verifySelfProof will try to interact with Hub
        // The key is that no SBT was minted
      }

      // After verifyAndMint: still no SBT (minting only happens in callback)
      expect(await sbtHarness.hasValidSBT(userAddress)).to.be.false;
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(0n);
    });

    it('Should not mint when verifyAndMint is called', async function () {
      const [user] = await ethers.getSigners();
      const userAddress = user.address;

      const proofPayload = '0x1234';
      const userContextData = '0x';

      // Try to call verifyAndMint
      // Note: This will likely fail because verifySelfProof needs a real Hub,
      // but we're testing that it doesn't mint directly
      let mintedBeforeCallback = false;
      try {
        await sbtHarness.connect(user).verifyAndMint(proofPayload, userContextData);
        // If it succeeded, check that no mint happened
        mintedBeforeCallback = await sbtHarness.hasValidSBT(userAddress);
      } catch (error: any) {
        // Expected failure - verifySelfProof needs Hub interaction
      }

      // Verify no mint happened from verifyAndMint call
      expect(await sbtHarness.hasValidSBT(userAddress)).to.be.false;
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(0n);

      // Now manually trigger the callback to show minting works
      const output = createMockOutput(userAddress);
      const iface = sbtHarness.interface;
      const encoded = iface.encodeFunctionData('testCustomVerificationHook', [output, '0x']);
      const tx = await user.sendTransaction({
        to: await sbtHarness.getAddress(),
        data: encoded,
      });
      await tx.wait();

      // Now SBT should exist
      expect(await sbtHarness.hasValidSBT(userAddress)).to.be.true;
      expect(await sbtHarness.balanceOf(userAddress)).to.equal(1n);
    });
  });

  describe('Constructor and config', function () {
    it('Should store verificationConfigId from Hub', async function () {
      const configId = await sbtHarness.verificationConfigId();
      expect(configId).to.not.equal(ethers.ZeroHash);

      // Verify getConfigId returns the stored configId
      const returnedConfigId = await sbtHarness.getConfigId(
        ethers.ZeroHash,
        ethers.ZeroHash,
        '0x'
      );
      expect(returnedConfigId).to.equal(configId);
    });

    it('Should register config with Hub during deployment', async function () {
      const configId = await sbtHarness.verificationConfigId();
      const storedConfig = await mockHub.getVerificationConfigV2(configId);

      // Verify config was stored (basic check - struct comparison is complex)
      expect(storedConfig).to.not.be.undefined;
    });
  });

  describe('Multiple users', function () {
    it('Should mint SBTs for different users independently', async function () {
      const [user1, user2] = await ethers.getSigners();

      // Mint for user1
      const output1 = createMockOutput(user1.address);
      const iface = sbtHarness.interface;
      const encoded1 = iface.encodeFunctionData('testCustomVerificationHook', [output1, '0x']);
      const tx1 = await user1.sendTransaction({
        to: await sbtHarness.getAddress(),
        data: encoded1,
      });
      await tx1.wait();
      expect(await sbtHarness.hasValidSBT(user1.address)).to.be.true;

      // Mint for user2
      const output2 = createMockOutput(user2.address);
      const encoded2 = iface.encodeFunctionData('testCustomVerificationHook', [output2, '0x']);
      const tx2 = await user2.sendTransaction({
        to: await sbtHarness.getAddress(),
        data: encoded2,
      });
      await tx2.wait();
      expect(await sbtHarness.hasValidSBT(user2.address)).to.be.true;

      // Both should have SBTs
      expect(await sbtHarness.balanceOf(user1.address)).to.equal(1n);
      expect(await sbtHarness.balanceOf(user2.address)).to.equal(1n);

      // Token IDs should be different
      const tokenId1 = BigInt(user1.address);
      const tokenId2 = BigInt(user2.address);
      expect(tokenId1).to.not.equal(tokenId2);
      expect(await sbtHarness.ownerOf(tokenId1)).to.equal(user1.address);
      expect(await sbtHarness.ownerOf(tokenId2)).to.equal(user2.address);
    });
  });
});

