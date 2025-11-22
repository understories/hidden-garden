import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('MockAztecVerifier', function () {
  let mockVerifier: any;

  beforeEach(async function () {
    const MockAztecVerifier = await ethers.getContractFactory('MockAztecVerifier');
    mockVerifier = await MockAztecVerifier.deploy();
  });

  it('Should always return true for any proof', async function () {
    const [signer] = await ethers.getSigners();
    const proof = '0x1234567890abcdef';
    const publicInputs = ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'bytes32', 'uint8'],
      [
        signer.address, // Use a valid address from signer
        '0x' + '1'.repeat(64),
        5,
      ]
    );

    // Use staticCall to get the return value without sending a transaction
    const result = await mockVerifier.verify.staticCall(proof, publicInputs);
    expect(result).to.be.true;
  });

  it('Should emit VerificationCalled event', async function () {
    const [signer] = await ethers.getSigners();
    const proof = '0xabcd';
    const publicInputs = '0x1234';

    const tx = await mockVerifier.connect(signer).verify(proof, publicInputs);
    const receipt = await tx.wait();

    // Find the VerificationCalled event
    const event = receipt?.logs.find(
      (log: any) => {
        try {
          const parsed = mockVerifier.interface.parseLog(log);
          return parsed?.name === 'VerificationCalled';
        } catch {
          return false;
        }
      }
    );

    expect(event).to.not.be.undefined;

    if (event) {
      const parsed = mockVerifier.interface.parseLog(event);
      expect(parsed?.args[0]).to.equal(signer.address); // caller
      expect(parsed?.args[1]).to.equal(BigInt(2)); // proofLength (0xabcd = 2 bytes)
      expect(parsed?.args[2]).to.equal(BigInt(2)); // publicInputsLength (0x1234 = 2 bytes)
    }
  });

  it('Should return true even with empty inputs', async function () {
    const result = await mockVerifier.verify.staticCall('0x', '0x');
    expect(result).to.be.true;
  });

  it('Should return true with large proof and public inputs', async function () {
    const largeProof = '0x' + 'ff'.repeat(1000); // 1000 bytes
    const largePublicInputs = '0x' + 'aa'.repeat(500); // 500 bytes

    const result = await mockVerifier.verify.staticCall(largeProof, largePublicInputs);
    expect(result).to.be.true;

    // Verify event was emitted with correct lengths
    const [signer] = await ethers.getSigners();
    const tx = await mockVerifier.connect(signer).verify(largeProof, largePublicInputs);
    const receipt = await tx.wait();

    const event = receipt?.logs.find(
      (log: any) => {
        try {
          const parsed = mockVerifier.interface.parseLog(log);
          return parsed?.name === 'VerificationCalled';
        } catch {
          return false;
        }
      }
    );

    if (event) {
      const parsed = mockVerifier.interface.parseLog(event);
      expect(parsed?.args[1]).to.equal(BigInt(1000)); // proofLength
      expect(parsed?.args[2]).to.equal(BigInt(500)); // publicInputsLength
    }
  });
});

