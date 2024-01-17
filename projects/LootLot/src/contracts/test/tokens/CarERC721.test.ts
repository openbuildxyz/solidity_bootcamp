import { expect } from 'chai';
import { Contract } from 'ethers';
import { ethers, upgrades } from 'hardhat';

describe('test CarERC721', async () => {
  let contract: Contract;
  beforeEach(async () => {
    const CarERC721 = await ethers.getContractFactory('CarERC721');
    contract = await upgrades.deployProxy(CarERC721);
    await contract.deployed();
  });
  it('test deploy', async () => {
    expect(contract).to.be.instanceOf(Contract);
    expect(await contract.name()).to.equal('LotLootCar');
    expect(await contract.symbol()).to.equal('LLC');
  });
  it('test mint', async () => {
    const [owner, add1] = await ethers.getSigners();
    const tokenId1 = 1001;
    await contract.safeMint(owner.address, tokenId1);
    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(tokenId1)).to.equal(owner.address);

    const tokenId2 = 1002;

    const revertedWith = `AccessControl: account ${ethers.utils
      .getAddress(add1.address)
      .toLowerCase()} is missing role ${ethers.utils.id('MINTER_ROLE')}`;

    await expect(
      contract.connect(add1).safeMint(add1.address, tokenId2)
    ).to.be.revertedWith(revertedWith);

    await contract.grantRole(ethers.utils.id('MINTER_ROLE'), add1.address);
    await contract.connect(add1).safeMint(add1.address, tokenId2);
    expect(await contract.balanceOf(add1.address)).to.equal(1);

    await contract.revokeRole(ethers.utils.id('MINTER_ROLE'), add1.address);
    await expect(
      contract.connect(add1).safeMint(add1.address, tokenId2)
    ).to.be.revertedWith(revertedWith);
    expect(await contract.ownerOf(tokenId2)).to.equal(add1.address);
  });
});
