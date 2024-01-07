import { expect } from "chai";
import { Contract } from "ethers";
import { ethers, upgrades } from "hardhat";

describe("ERC721Car", async () => {
  let contract: Contract;

  beforeEach(async () => {
    const ERC721CarContract = await ethers.getContractFactory("ERC721Car");
    contract = await upgrades.deployProxy(ERC721CarContract, [
      "LotLootCar",
      "LLC",
    ]);
    await contract.deployed();
  });

  it("ERC721Car Test", async () => {
    expect(contract).to.be.instanceOf(Contract);
    expect(await contract.name()).to.equal("LotLootCar");
    expect(await contract.symbol()).to.equal("LLC");
  });

  it("ERC721Car mint", async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();
    console.log("contract.address", contract.address);

    const tokenId1 = 1001;
    const revertedWith = `AccessControl: account ${ethers.utils
      .getAddress(addr1.address)
      .toLowerCase()} is missing role ${ethers.utils.id("MINTER_ROLE")}`;
    await expect(
      contract.connect(addr1).safeMint(owner.address, tokenId1)
    ).to.be.revertedWith(revertedWith);

    contract.grantRole(ethers.utils.id("MINTER_ROLE"), addr1.address);

    expect(await contract.connect(addr1).safeMint(owner.address, tokenId1))
      .to.emit(contract, "Transfer")
      .withArgs(ethers.constants.AddressZero, owner.address, tokenId1);

    expect(await contract.balanceOf(owner.address)).to.equal(1);
    expect(await contract.ownerOf(tokenId1)).to.equal(owner.address);
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.tokenByIndex(0)).to.equal(tokenId1);

    const tokenId2 = 1002;

    expect(await contract.connect(addr1).safeMint(addr1.address, tokenId2))
      .to.emit(contract, "Transfer")
      .withArgs(ethers.constants.AddressZero, addr1.address, tokenId2);
    expect(await contract.balanceOf(addr1.address)).to.equal(1);

    const tokenId3 = 1003;
    expect(await contract.connect(addr1).safeMint(addr2.address, tokenId3))
      .to.emit(contract, "Transfer")
      .withArgs(ethers.constants.AddressZero, addr2.address, tokenId3);
    expect(await contract.balanceOf(addr2.address)).to.equal(1);

    const tokenId4 = 1004;
    expect(await contract.connect(addr1).safeMint(addr2.address, tokenId4))
      .to.emit(contract, "Transfer")
      .withArgs(ethers.constants.AddressZero, addr2.address, tokenId4);
    expect(await contract.balanceOf(addr2.address)).to.equal(2);
  });
});
