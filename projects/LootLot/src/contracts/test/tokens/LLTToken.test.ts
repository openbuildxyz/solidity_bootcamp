import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe('LLTToken', function () {
  let contract: Contract;

  beforeEach(async function () {
    const Token = await ethers.getContractFactory('LLTToken');
    contract = await upgrades.deployProxy(Token);
    await contract.deployed();
  });
  it('Lotloot test', async () => {
    expect(contract).to.be.instanceOf(Contract);
    expect(await contract.name()).to.equal('LotLootToken');
    expect(await contract.symbol()).to.equal('LLT');
  });

  it('shoule get Role to Mint', async () => {
    const [owner, add1, add2] = await ethers.getSigners();
    await contract.mint(owner.address, 100);
    expect(await contract.balanceOf(owner.address)).to.equal(100);
    const revertedWith = `AccessControl: account ${ethers.utils
      .getAddress(add1.address)
      .toLowerCase()} is missing role ${ethers.utils.id('MINTER_ROLE')}`;
    await expect(
      contract.connect(add1).mint(add1.address, 100)
    ).to.be.revertedWith(revertedWith);

    await contract.grantRole(ethers.utils.id('MINTER_ROLE'), add1.address);
    await contract.mint(add1.address, 100);
    expect(await contract.balanceOf(add1.address)).to.equal(100);

    await contract.revokeRole(ethers.utils.id('MINTER_ROLE'), add1.address);
    await expect(
      contract.connect(add1).mint(add1.address, 100)
    ).to.be.revertedWith(revertedWith);
  });
});
