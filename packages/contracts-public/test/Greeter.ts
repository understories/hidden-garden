import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('Greeter', function () {
  it('Should return the greeting', async function () {
    const Greeter = await ethers.getContractFactory('Greeter');
    const greeter = await Greeter.deploy('Hello, Hidden Garden');

    expect(await greeter.greet()).to.equal('Hello, Hidden Garden');
  });
});

