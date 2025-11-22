import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('SkillLeaderboard - ZK Proof Integration', function () {
  let selfHumanSBT: any;
  let skillLeaderboard: any;
  let mockVerifier: any;
  let user: any;
  let otherUser: any;

  // Helper function to create mock output for SBT minting
  function createMockOutput(userAddress: string): any {
    const userIdentifier = BigInt(userAddress);
    return [
      ethers.ZeroHash, // attestationId
      userIdentifier, // userIdentifier
      ethers.ZeroHash, // nullifier
      [0n, 0n, 0n, 0n], // forbiddenCountriesListPacked
      '', // issuingState
      [], // name
      '', // idNumber
      '', // nationality
      '', // dateOfBirth
      '', // gender
      '', // expiryDate
      0n, // olderThan
      [false, false, false], // ofac
    ];
  }

  beforeEach(async function () {
    // Deploy mock Hub for SelfHumanSBT
    const MockHub = await ethers.getContractFactory('MockIdentityVerificationHubV2');
    const mockHub = await MockHub.deploy();

    // Create minimal verification config
    const rawConfig = {
      olderThan: 18,
      forbiddenCountries: [],
      ofacEnabled: false,
    };

    // Deploy mock Aztec verifier
    const MockAztecVerifier = await ethers.getContractFactory('MockAztecVerifier');
    mockVerifier = await MockAztecVerifier.deploy();

    // Deploy SelfHumanSBT test harness (which extends SelfHumanSBT and exposes the hook)
    // We'll use this as the SBT contract for SkillLeaderboard so we can mint SBTs in tests
    const TestHarness = await ethers.getContractFactory('SelfHumanSBTTestHarness');
    selfHumanSBT = await TestHarness.deploy(
      await mockHub.getAddress(),
      'proof-of-human',
      rawConfig
    );

    // Deploy SkillLeaderboard with the test harness as the SBT contract
    const SkillLeaderboard = await ethers.getContractFactory('SkillLeaderboard');
    skillLeaderboard = await SkillLeaderboard.deploy(
      await selfHumanSBT.getAddress(),
      await mockVerifier.getAddress()
    );

    const signers = await ethers.getSigners();
    user = signers[0];
    otherUser = signers[1];

    // Mint SBT for user using the test harness's exposed hook
    const output = createMockOutput(user.address);
    await selfHumanSBT.testCustomVerificationHook(output, '0x');

    // Verify SBT was minted
    expect(await selfHumanSBT.hasValidSBT(user.address)).to.be.true;
  });

  describe('submitSkillTierWithProof', function () {
    it('Should work with mock verifier - full end-to-end flow', async function () {
      const skillHash = ethers.keccak256(ethers.toUtf8Bytes('rust'));
      const minLevel = 7;

      // Construct dummy proof bytes (mock verifier accepts any proof)
      const proof = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

      // Encode public inputs: abi.encode(user.address, skillHash, minLevel)
      const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32', 'uint8'],
        [user.address, skillHash, minLevel]
      );

      // Call submitSkillTierWithProof
      const tx = await skillLeaderboard
        .connect(user)
        .submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);

      const receipt = await tx.wait();

      // Assert: Transaction does not revert
      expect(receipt).to.not.be.null;
      expect(receipt.status).to.equal(1);

      // Assert: skillTier is set correctly
      const storedTier = await skillLeaderboard.skillTier(skillHash, user.address);
      expect(storedTier).to.equal(BigInt(minLevel));

      // Assert: SkillRevealed event was emitted with correct args
      const eventFilter = skillLeaderboard.filters.SkillRevealed(user.address, skillHash, null);
      const events = await skillLeaderboard.queryFilter(eventFilter, receipt.blockNumber, receipt.blockNumber);

      expect(events.length).to.equal(1);
      expect(events[0].args.user).to.equal(user.address);
      expect(events[0].args.skillHash).to.equal(skillHash);
      expect(events[0].args.tier).to.equal(BigInt(minLevel));
    });

    it('Should fail when publicInputs do not match msg.sender', async function () {
      const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));
      const minLevel = 5;
      const proof = '0xabcd';

      // Encode public inputs with a different address than msg.sender
      const wrongAddress = otherUser.address;
      const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32', 'uint8'],
        [wrongAddress, skillHash, minLevel]
      );

      // Attempt to call with mismatched address
      try {
        await skillLeaderboard
          .connect(user)
          .submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);
        expect.fail('Expected transaction to revert');
      } catch (error: any) {
        // Should revert with "Public input user address must match caller"
        const errorStr = error.message || error.toString() || '';
        expect(errorStr).to.include('Public input user address must match caller');
      }
    });

    it('Should be blocked without SBT', async function () {
      const skillHash = ethers.keccak256(ethers.toUtf8Bytes('typescript'));
      const minLevel = 4;
      const proof = '0xdef123';

      // Encode public inputs for user without SBT
      const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32', 'uint8'],
        [otherUser.address, skillHash, minLevel]
      );

      // Verify otherUser does not have SBT
      expect(await selfHumanSBT.hasValidSBT(otherUser.address)).to.be.false;

      // Attempt to call without SBT
      try {
        await skillLeaderboard
          .connect(otherUser)
          .submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);
        expect.fail('Expected transaction to revert');
      } catch (error: any) {
        // Should revert due to hasValidSBT check
        const errorStr = error.message || error.toString() || '';
        expect(errorStr).to.include('Only human-verified users can submit skill tiers');
      }
    });

    it('Should fail when skill hash in publicInputs does not match function argument', async function () {
      const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));
      const wrongSkillHash = ethers.keccak256(ethers.toUtf8Bytes('rust'));
      const minLevel = 3;
      const proof = '0xabcd';

      // Encode public inputs with wrong skill hash
      const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32', 'uint8'],
        [user.address, wrongSkillHash, minLevel]
      );

      try {
        await skillLeaderboard
          .connect(user)
          .submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);
        expect.fail('Expected transaction to revert');
      } catch (error: any) {
        const errorStr = error.message || error.toString() || '';
        expect(errorStr).to.include('Public input skill hash must match function argument');
      }
    });

    it('Should fail when min level in publicInputs does not match function argument', async function () {
      const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));
      const minLevel = 3;
      const wrongMinLevel = 5;
      const proof = '0xabcd';

      // Encode public inputs with wrong min level
      const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32', 'uint8'],
        [user.address, skillHash, wrongMinLevel]
      );

      try {
        await skillLeaderboard
          .connect(user)
          .submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);
        expect.fail('Expected transaction to revert');
      } catch (error: any) {
        const errorStr = error.message || error.toString() || '';
        expect(errorStr).to.include('Public input min level must match function argument');
      }
    });

    it('Should reject min level 0', async function () {
      const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));
      const minLevel = 0;
      const proof = '0xabcd';
      const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32', 'uint8'],
        [user.address, skillHash, minLevel]
      );

      try {
        await skillLeaderboard
          .connect(user)
          .submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);
        expect.fail('Expected transaction to revert');
      } catch (error: any) {
        const errorStr = error.message || error.toString() || '';
        expect(errorStr).to.include('Min level must be greater than 0');
      }
    });

    it('Should reject min level > 10', async function () {
      const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));
      const minLevel = 11;
      const proof = '0xabcd';
      const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
        ['address', 'bytes32', 'uint8'],
        [user.address, skillHash, minLevel]
      );

      try {
        await skillLeaderboard
          .connect(user)
          .submitSkillTierWithProof(skillHash, minLevel, proof, publicInputs);
        expect.fail('Expected transaction to revert');
      } catch (error: any) {
        const errorStr = error.message || error.toString() || '';
        expect(errorStr).to.include('at most 10');
      }
    });
  });
});
