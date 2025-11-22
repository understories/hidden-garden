import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('SkillLeaderboard', function () {
  let selfHumanSBT: any;
  let skillLeaderboard: any;
  let userWithSbt: any;
  let userWithoutSbt: any;

  beforeEach(async function () {
    const SelfHumanSBT = await ethers.getContractFactory('SelfHumanSBT');
    selfHumanSBT = await SelfHumanSBT.deploy();

    const SkillLeaderboard = await ethers.getContractFactory('SkillLeaderboard');
    skillLeaderboard = await SkillLeaderboard.deploy(await selfHumanSBT.getAddress());

    const signers = await ethers.getSigners();
    userWithSbt = signers[0];
    userWithoutSbt = signers[1];

    await selfHumanSBT.connect(userWithSbt).verifyAndMint('0x1234');
  });

  it('Should allow SBT holder to submit skill tier', async function () {
    const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));
    const tier = 3;

    const tx = await skillLeaderboard.connect(userWithSbt).submitSkillTier(skillHash, tier);
    const receipt = await tx.wait();

    expect(receipt).to.not.be.null;
    const event = receipt?.logs.find(
      (log: any) => log.topics[0] === ethers.id('SkillRevealed(address,bytes32,uint8)')
    );
    expect(event).to.not.be.undefined;

    expect(await skillLeaderboard.skillTier(skillHash, userWithSbt.address)).to.equal(BigInt(tier));
  });

  it('Should reject skill tier submission from non-SBT user', async function () {
    const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));
    const tier = 3;

    try {
      await skillLeaderboard.connect(userWithoutSbt).submitSkillTier(skillHash, tier);
      expect.fail('Expected transaction to revert');
    } catch (error: any) {
      expect(error.message).to.include('Only human-verified users can submit skill tiers');
    }
  });

  it('Should reject tier 0', async function () {
    const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));

    try {
      await skillLeaderboard.connect(userWithSbt).submitSkillTier(skillHash, 0);
      expect.fail('Expected transaction to revert');
    } catch (error: any) {
      expect(error.message).to.include('Tier must be greater than 0');
    }
  });

  it('Should reject tier > 10', async function () {
    const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));

    try {
      await skillLeaderboard.connect(userWithSbt).submitSkillTier(skillHash, 11);
      expect.fail('Expected transaction to revert');
    } catch (error: any) {
      expect(error.message).to.include('Tier must be at most 10');
    }
  });

  it('Should allow updating skill tier', async function () {
    const skillHash = ethers.keccak256(ethers.toUtf8Bytes('solidity'));

    await skillLeaderboard.connect(userWithSbt).submitSkillTier(skillHash, 3);
    expect(await skillLeaderboard.skillTier(skillHash, userWithSbt.address)).to.equal(3n);

    await skillLeaderboard.connect(userWithSbt).submitSkillTier(skillHash, 5);
    expect(await skillLeaderboard.skillTier(skillHash, userWithSbt.address)).to.equal(5n);
  });
});

