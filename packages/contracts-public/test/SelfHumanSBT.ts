import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('SelfHumanSBT', function () {
  it('Should mint SBT and verify ownership', async function () {
    const SelfHumanSBT = await ethers.getContractFactory('SelfHumanSBT');
    const sbt = await SelfHumanSBT.deploy();

    const [signer] = await ethers.getSigners();

    await sbt.connect(signer).verifyAndMint('0x1234');

    expect(await sbt.hasValidSBT(signer.address)).to.be.true;
  });

  it('Should revert on double mint', async function () {
    const SelfHumanSBT = await ethers.getContractFactory('SelfHumanSBT');
    const sbt = await SelfHumanSBT.deploy();

    const [signer] = await ethers.getSigners();

    await sbt.connect(signer).verifyAndMint('0x1234');

    try {
      await sbt.connect(signer).verifyAndMint('0x1234');
      expect.fail('Expected transaction to revert');
    } catch (error: any) {
      expect(error.message).to.include('SBT already exists for this address');
    }
  });
});

