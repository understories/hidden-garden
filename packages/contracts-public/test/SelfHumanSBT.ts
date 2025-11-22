import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('SelfHumanSBT', function () {
  // Note: These tests are legacy and use the old API. For comprehensive tests,
  // see test/SelfHumanSBT.self.ts which tests the Self.xyz integration properly.
  
  it('Should mint SBT and verify ownership', async function () {
    // Deploy mock Hub
    const MockHub = await ethers.getContractFactory('MockIdentityVerificationHubV2');
    const mockHub = await MockHub.deploy();

    const rawConfig = {
      olderThan: 18,
      forbiddenCountries: [],
      ofacEnabled: false,
    };

    // Deploy SelfHumanSBT with proper constructor
    const SelfHumanSBT = await ethers.getContractFactory('SelfHumanSBT');
    const sbt = await SelfHumanSBT.deploy(
      await mockHub.getAddress(),
      'proof-of-human',
      rawConfig
    );

    // Use test harness to mint SBT directly (bypassing Self verification)
    const TestHarness = await ethers.getContractFactory('SelfHumanSBTTestHarness');
    const sbtHarness = await TestHarness.deploy(
      await mockHub.getAddress(),
      'proof-of-human',
      rawConfig
    );

    const [signer] = await ethers.getSigners();
    const userIdentifier = BigInt(signer.address);
    const output = [
      ethers.ZeroHash,
      userIdentifier,
      ethers.ZeroHash,
      [0n, 0n, 0n, 0n],
      '',
      [],
      '',
      '',
      '',
      '',
      '',
      0n,
      [false, false, false],
    ];

    await sbtHarness.testCustomVerificationHook(output, '0x');

    expect(await sbtHarness.hasValidSBT(signer.address)).to.be.true;
  });

  it('Should revert on double mint', async function () {
    // Deploy mock Hub
    const MockHub = await ethers.getContractFactory('MockIdentityVerificationHubV2');
    const mockHub = await MockHub.deploy();

    const rawConfig = {
      olderThan: 18,
      forbiddenCountries: [],
      ofacEnabled: false,
    };

    // Use test harness
    const TestHarness = await ethers.getContractFactory('SelfHumanSBTTestHarness');
    const sbtHarness = await TestHarness.deploy(
      await mockHub.getAddress(),
      'proof-of-human',
      rawConfig
    );

    const [signer] = await ethers.getSigners();
    const userIdentifier = BigInt(signer.address);
    const output = [
      ethers.ZeroHash,
      userIdentifier,
      ethers.ZeroHash,
      [0n, 0n, 0n, 0n],
      '',
      [],
      '',
      '',
      '',
      '',
      '',
      0n,
      [false, false, false],
    ];

    await sbtHarness.testCustomVerificationHook(output, '0x');

    try {
      await sbtHarness.testCustomVerificationHook(output, '0x');
      expect.fail('Expected transaction to revert');
    } catch (error: any) {
      const errorStr = error.message || error.toString() || '';
      expect(errorStr).to.include('SBT already exists');
    }
  });
});

